import re
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI
from helper.fga_retriever import FGARetriever
from openfga_sdk.client.models import ClientBatchCheckItem
from helper.constants import *
from langchain_core.runnables import Runnable

class JobPostingRunnable(Runnable):
    def __init__(self, job_posting):
        self.job_posting = job_posting
    
    def invoke(self, *args, **kwargs):
        return self.job_posting.page_content
    
class RAG:
    def __init__(self):
        # Initialize llm and prompts
        self.query_prompt = ChatPromptTemplate.from_template(
            """You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.\\nQuestion: {question}\\nContext: {context}\\nAnswer:"""
        )

        self.interview_prompt = ChatPromptTemplate.from_template(
            """You are a recruiter tasked with generating interview questions based on a candidate's resume and the job posting.
            Resume:
            {resume_info}
            Job Posting:
            {job_posting_info}
            Generate 10 interview questions that assess the candidate's fit for the job, based on their experience, skills, and qualifications listed in the resume and the job description."""
        )

        self.llm = ChatOpenAI(model="gpt-4o-mini")

    def query_resume(self, user_id, question, vector_store):
        chain = (
            {
                "context": FGARetriever(
                    retriever=vector_store,
                    build_query=lambda doc: ClientBatchCheckItem(
                        user=f"user:{user_id}",
                        object=f"resume:{doc.metadata.get('id')}",
                        relation="owner",
                    ),
                ),
                "question": RunnablePassthrough(),
            }
            | self.query_prompt 
            | self.llm
            | StrOutputParser()
        )

        return chain.invoke(question)
    

    def query_related_posting(self, question, vector_store):
        jobs = vector_store.get_relevant_jobs(question)
        if not jobs:
            return []
        
        return jobs

    def query_posting(self, job_id, question, vector_store):
        job_posting = vector_store.get_document_by_id(job_id)
        if not job_posting:
            return "Job posting not found."
        
        # Wrap the job posting content in a Runnable
        job_posting_runnable = JobPostingRunnable(job_posting)

        chain = (
            {
                "context": job_posting_runnable,  
                "question": RunnablePassthrough(),
            }
            | self.query_prompt 
            | self.llm 
            | StrOutputParser() 
        )

        return chain.invoke(question)
    
    # Function to generate interview questions
    def get_questions(self, resume_info_list, job_posting_info_list):
        resume_info = "\n".join(resume_info_list)
        job_posting_info = "\n".join(job_posting_info_list)

        chain = (
            {
                "resume_info": RunnablePassthrough(),
                "job_posting_info": RunnablePassthrough(),
            }
            | self.interview_prompt
            | self.llm
            | StrOutputParser()  
        )

        response = chain.invoke({
            'resume_info': resume_info,
            'job_posting_info': job_posting_info,
        })

        # Split the response into lines by newlines
        interview_questions_list = response.split("\n")
        
        cleaned_questions = []
        
        current_question = ""
        for line in interview_questions_list:
            line = line.strip()  
            
            if re.match(r"^\d+\.", line):
                # If we already have a current question, add it to the list
                if current_question:
                    cleaned_questions.append(current_question.strip())
                
                # Start a new question with this line
                current_question = line
            else:
                # If the line isn't a number, append it to the current question
                if current_question:
                    current_question += " " + line
        
        # After the loop, add the last question if any
        if current_question:
            cleaned_questions.append(current_question.strip())
        
        return cleaned_questions

    def generate_interview_questions(self, user_id, job_id, resume_store, posting_store):
        resume_infos = []
        job_infos = []

        # For each resume predefined questions get info
        for predefined_question in PREDEFINED_QUESTIONS_RESUME:
            resume_info = self.query_resume(user_id, predefined_question, resume_store)  
            resume_infos.append(resume_info)

        # For each job posting predefined questions get info
        for predefined_question in PREDEFINED_QUESTIONS_POSTING:
            job_info = self.query_posting(job_id, predefined_question, posting_store)  
            job_infos.append(job_info)
        
        interview_questions = self.get_questions(resume_infos, job_infos)
        return interview_questions