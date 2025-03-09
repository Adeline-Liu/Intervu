import os
import uuid
import asyncio
from pydantic import BaseModel
import uvicorn
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from dotenv import load_dotenv
from openfga_sdk import (
    ClientConfiguration,
    Metadata,
    RelationMetadata,
    RelationReference,
    TypeDefinition,
    WriteAuthorizationModelRequest,
    Userset,
    OpenFgaClient,
)
from openfga_sdk.client.models import ClientTuple
from openfga_sdk.credentials import CredentialConfiguration, Credentials
from langchain.schema import Document
from helper.rag import RAG
from helper.fga_retriever import FGARetriever
from helper.open_search_store import OpenSearchStore
from helper.read_doc import *
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from typing import Dict
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Initialize OpenSearch Store
store = OpenSearchStore.generate_store()
resume_store = store.store["resumes"]
posting_store = store.store["postings"]

# Initialize RAG
rag = RAG()

class QuestionAnswer(BaseModel):
    response: Dict[str, Dict[str, str]]
    
# Initialize OpenFGA client configuration
def get_fga_client():
    fga_configuration = ClientConfiguration(
        api_url=os.getenv("FGA_API_URL") or "api.us1.fga.dev",
        store_id=os.getenv("FGA_STORE_ID"),
        credentials=Credentials(
            method="client_credentials",
            configuration=CredentialConfiguration(
                api_issuer=os.getenv("FGA_API_TOKEN_ISSUER") or "auth.fga.dev",
                api_audience=os.getenv("FGA_API_AUDIENCE") or "https://api.us1.fga.dev/",
                client_id=os.getenv("FGA_CLIENT_ID"),
                client_secret=os.getenv("FGA_CLIENT_SECRET"),
            ),
        ),
    )
    return OpenFgaClient(fga_configuration)

# Helper function to convert job posting details to a PDF
def convert_to_pdf(job_id, job_title, job_description, job_company, output_path):
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter

    # Add content to the PDF
    c.setFont("Helvetica", 12)

    # Add Job Title
    c.drawString(50, height - 50, f"Job Title: {job_title}")

    # Add Company
    c.drawString(50, height - 80, f"Company: {job_company}")

    # Add Job Description with wrapping and multiple lines
    text_object = c.beginText(50, height - 120)
    text_object.setFont("Helvetica", 10)
    text_object.setTextOrigin(50, height - 120)  # Set starting point for text
    
    # Word wrap the job description text
    job_description_lines = wrap_text(job_description, 450)  # 450 is the width of the area to wrap within

    # Loop through the lines of text and add them to the PDF
    for line in job_description_lines:
        text_object.textLine(line)

    c.drawText(text_object)
    c.showPage()  # Finish this page
    c.save()  # Save the PDF

# Helper function for text wrapping
def wrap_text(text, max_width):
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.pdfgen import canvas
    from reportlab.lib import colors

    # Create a canvas to measure the text width
    temp_canvas = canvas.Canvas("/dev/null", pagesize=letter)  # Dummy canvas to calculate width

    lines = []
    words = text.split(' ')
    current_line = []

    for word in words:
        current_line.append(word)
        line_width = temp_canvas.stringWidth(' '.join(current_line), "Helvetica", 10)

        if line_width > max_width:
            # If the current line exceeds the max width, push the current line and start a new one
            lines.append(' '.join(current_line[:-1]))
            current_line = [word]

    # Add any remaining words in the last line
    if current_line:
        lines.append(' '.join(current_line))

    return lines

# Helper function to validate file type
def is_valid_file_type(file: UploadFile):
    allowed_extensions = ["pdf"]
    file_extension = file.filename.split(".")[-1].lower()
    return file_extension in allowed_extensions

# Function to initialize FGA (model setup)
async def initialize_fga():
    async with get_fga_client() as fga_client:
        # Define 'user' type
        user_type = TypeDefinition(type="user")

        # Define relations for resume documents
        resume_relations = dict(
            owner=Userset(this=dict()),
            viewer=Userset(this=dict()),
        )

        resume_metadata = Metadata(
            relations=dict(
                owner=RelationMetadata(
                    directly_related_user_types=[
                        RelationReference(type="user"),
                    ]
                ),
                viewer=RelationMetadata(
                    directly_related_user_types=[
                        RelationReference(type="user"),
                        RelationReference(type="user", wildcard={}),
                    ]
                ),
            )
        )

        # Define 'resume' type
        resume_type = TypeDefinition(
            type="resume", relations=resume_relations, metadata=resume_metadata
        )

        # Authorization model request for FGA
        authorization_model_request = WriteAuthorizationModelRequest(
            schema_version="1.1",
            type_definitions=[user_type, resume_type],
            conditions=dict(),
        )

        model = await fga_client.write_authorization_model(authorization_model_request)
        print("NEW MODEL ID:", model)

# Endpoint for uploading resume
@app.post("/upload_resume/{user_id}")
async def upload_resume(user_id: str, file: UploadFile = File(...)):
    # Validate the file type 
    if not is_valid_file_type(file):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF file are allowed.")

    # Generate a unique identifier for the resume
    user_id= user_id.strip(" ")
    resume_id = f"{user_id}-{uuid.uuid4()}"

    # Save the uploaded file locally
    file_location = f"resumes/{resume_id}.{file.filename.split('.')[-1]}"
    try:
        os.makedirs(os.path.dirname(file_location), exist_ok=True)
        with open(file_location, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving the file: {str(e)}")

    # Write the relationship in OpenFGA using write_tuples (only the owner can access the resume)
    try:
        async with get_fga_client() as fga_client:
            await fga_client.write_tuples(
                body=[
                    ClientTuple(user=f"user:{user_id}", relation="owner", object=f"resume:{resume_id}"),
                    ClientTuple(user=f"user:{user_id}", relation="viewer", object=f"resume:{resume_id}"), 
                ]
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error writing FGA tuples: {str(e)}")
    
    try:
        content = read_pdf(file_location)
        # Create Document object to be added to OpenSearch
        document = Document(
            page_content=content,  # The text of the resume (in real scenarios, you would extract text from the PDF)
            metadata={"id": resume_id, "access": "private"}  # Custom metadata, adjust as needed
        )

        # add document to openSearch store
        resume_store.add_documents([document])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving document to openSearch store: {str(e)}")
    
    # default code is 200
    return {"message": f"Resume uploaded successfully and linked to user {user_id}", "resume_id": resume_id}


# Endpoint for saving job posting
@app.post("/upload_posting/{job_id}")
async def upload_posting(
    job_id: str,
    job_title: str = Form(...),
    job_description: str = Form(...),
    job_company: str = Form(...),
):

    # print(job_description)
    file_location = f"postings/{job_id}.pdf"

    # Check and create the directory if it doesn't exist
    try:
        os.makedirs(os.path.dirname(file_location), exist_ok=True)
        # Convert the job posting data to PDF
        convert_to_pdf(job_id, job_title, job_description, job_company, file_location)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating the PDF: {str(e)}")

    # Prepare the job posting document
    document = Document(
        page_content=job_description,  # The job description as the content
        metadata={
            "id": job_id, 
            "job_title": job_title,
            "job_company": job_company,
            "access": "public"  
        }
    )

    # Save the document in the job posting store
    try:
        posting_store.add_documents([document], index_type='postings')
        return {"message": f"Job posting {job_id} uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving job posting: {str(e)}")
    
# FastAPI endpoint to get questions
@app.get("/get_questions/{user_id}/{job_id}")
async def get_questions(user_id: str, job_id: str):
    try:
        questions = rag.generate_interview_questions(user_id, job_id, resume_store, posting_store)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# FastAPI endpoint to get related jobs
@app.get("/get_jobs")
async def get_related_jobs(query: str = Form(...),):
    try:
        jobs = rag.query_related_posting(query, posting_store)
        if not jobs:
            raise HTTPException(status_code=400, detail="No related jobs find in the database")
        return {"jobs": jobs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Create a template for the LangChain to format the feedback
feedback_template = """
You are an AI reviewer. Below are some interview questions and answers.
{questions_and_answers}
Provide constructive feedback in the form of a well-written paragraph.
"""

@app.get("/feedback/")
async def get_feedback(data: QuestionAnswer):
    try:
        # Extract the question and answer pairs from the incoming data
        response_data = data.response
        questions_and_answers = ""

        # Format the question-answer pairs for the LangChain prompt
        for key, qa_pair in response_data.items():
            question = qa_pair.get(f"question{key}")
            answer = qa_pair.get(f"answer{key}")
            questions_and_answers += f"Question {key}: {question}\nAnswer {key}: {answer}\n\n"

        # Create the LangChain prompt
        prompt = feedback_template.format(questions_and_answers=questions_and_answers)

        # Run the prompt through LangChain
        llm = OpenAI(temperature=0.7)
        llm_chain = LLMChain(llm=llm, prompt=PromptTemplate(input_variables=["questions_and_answers"], template=prompt))
        feedback = llm_chain.run({"questions_and_answers": questions_and_answers}).strip("\n")

        # Return the feedback as a JSON response
        return {"feedback": feedback}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing data: {str(e)}")
    
# Run FastAPI app
if __name__ == "__main__":
    # Initialize FGA schema and tuples if not already initialized
    asyncio.run(initialize_fga())
    
    # Start the FastAPI app
    uvicorn.run(app, host="0.0.0.0", port=8000)
