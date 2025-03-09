from opensearchpy import NotFoundError, OpenSearch, RequestsHttpConnection
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import VectorStore
from langchain.schema import Document
import boto3
from requests_aws4auth import AWS4Auth

class OpenSearchVectorStore(VectorStore):
    def __init__(self, client, index_name, embedding_model):
        self.client = client
        self.index_name = index_name
        self.embedding_model = embedding_model

    def from_texts(self, texts, metadata=None):
        pass

    def similarity_search(self, query, k=5):
        pass

    def add_documents(self, documents, index_type='resumes'):     
        # Determine the appropriate index based on the type of document
        if index_type == 'resumes':
            index_name = 'resumes'
        elif index_type == 'postings':
            index_name = 'postings'
        else:
            raise ValueError("Invalid index type. Use 'resumes' or 'postings'.")

        for doc in documents:
            embedding = self.embedding_model.embed_documents([doc.page_content])[0]

            # Prepare the document body to store in OpenSearch
            doc_body = {
                "text": doc.page_content,  
                "embedding": embedding, 
                "metadata": doc.metadata 
            }

            self.client.index(index=index_name, body=doc_body, id = doc.metadata["id"])

    def get_document_by_id(self, job_id):
        try:
            # Perform the get request using the job_id as the document ID
            response = self.client.get(
                index="postings",  
                id=job_id 
            )
            
            text = response['_source'].get('text', "")  # Get 'text' field from document
            metadata = response['_source'].get('metadata', {})  # Get 'metadata' field from document
            
            document = Document(page_content=text, metadata=metadata)
            
            return document
        
        except NotFoundError:
            # Handle the case where the document with the given ID is not found
            print(f"Document with job_id {job_id} not found.")
            return None
        except Exception as e:
            # Catch any other exceptions and log them
            print(f"An error occurred: {e}")
            return None
        
    def get_relevant_jobs(self, query, threshold=0.70):
        # Get the embedding of the query
        query_embedding = self.embedding_model.embed_query(query)

        # Perform k-NN search in OpenSearch
        response = self.client.search(
            index="postings",
            body={
                "size": 1000, 
                "query": {
                    "knn": {
                        "embedding": {
                            "vector": query_embedding,
                            "k": 1000  
                        }
                    }
                }
            }
        )

        # Map OpenSearch response to langchain Document objects with metadata
        opensearch_hits = response['hits']['hits']
        documents = []
        for hit in opensearch_hits:
            score = hit['_score']  # In OpenSearch, _score represents similarity
            print(score)
            
            if score >= threshold:  # Apply the threshold here
                metadata = hit["_source"].get("metadata", {})
                text = hit["_source"].get("text", "")

                # Extract the necessary fields (id, job_title, job_company, job_description)
                job_id = metadata.get("id", "")
                job_title = metadata.get("job_title", "")
                job_company = metadata.get("job_company", "")
                job_description = text 
                
                # Prepare a dictionary or a custom Document-like object with only the desired fields
                document = {
                    "id": job_id,
                    "job_title": job_title,
                    "job_company": job_company,
                    "job_description": job_description
                }
                
                documents.append(document)  

        return documents

       
    def _get_relevant_documents(self, query, index_type='resumes', run_manager=None):
        # Get the embedding of the query
        query_embedding = self.embedding_model.embed_query(query)

        # Determine the index to query based on the index type
        if index_type == 'resumes':
            index_name = 'resumes'
        elif index_type == 'postings':
            index_name = 'postings'
        else:
            raise ValueError("Invalid index type. Use 'resumes' or 'postings'.")

        # Perform k-NN search in OpenSearch
        response = self.client.search(
            index=index_name,
            body={
                "size": 4,   
                "query": {
                    "knn": {
                        "embedding": {
                            "vector": query_embedding,
                            "k": 4    
                        }
                    }
                }
            }
        )

        opensearch_hits = response['hits']['hits']
        documents = []
        for hit in opensearch_hits:
            text = hit["_source"].get("text", "")
            metadata = hit["_source"].get("metadata", {})

            document = Document(page_content=text, metadata=metadata)
            documents.append(document)
        return documents


class OpenSearchStore:
    def __init__(self, resume_store, posting_store):
        self.store = {
            "resumes": resume_store,
            "postings": posting_store,
        }

    @classmethod
    def generate_store(cls):
        # Initialize boto3 session and get credentials
        session = boto3.Session()
        credentials = session.get_credentials()

        # If credentials are None, you should recheck your AWS credentials setup
        if not credentials or not credentials.access_key or not credentials.secret_key:
            raise ValueError("AWS credentials are missing or invalid")
        
        # Define the region and service for AWS OpenSearch
        region = 'us-east-1'
        service = 'es'
        host = 'search-hackthonwow-nowskhquprrk3q7hdewwjfgsra.us-east-1.es.amazonaws.com'
        
        # Create AWS4Auth object for signing requests
        awsauth = AWS4Auth(
            credentials.access_key,  # First positional argument (access key)
            credentials.secret_key,  # Second positional argument (secret key)
            region,                  # Keyword argument for region
            service,                 # Keyword argument for service
            session_token=credentials.token  # Optional: Keyword argument for session token (if using temporary credentials)
        )
        
        # OpenSearch client setup
        client = OpenSearch(
            hosts = [{'host': host, 'port': 443}],
            http_auth = awsauth,
            use_ssl = True,
            verify_certs = True,
            http_compress = True, 
            connection_class = RequestsHttpConnection
        )
        
        # Test connection (ping OpenSearch)
        if client.ping():
            print("Connection successful!")
        else:
            print("Connection failed!")

        # Define the OpenSearch index names
        index_names = ['resumes', 'postings']
        
        # Ensure that both indices exist, create them if not
        for index_name in index_names:
            if not client.indices.exists(index=index_name):
                client.indices.create(index=index_name, body={
                    "settings": {
                        "index": {
                            "knn": True,  # Enable k-NN search
                            "number_of_shards": 3,
                            "number_of_replicas": 2
                        }
                    },
                    "mappings": {
                        "properties": {
                            "text": {"type": "text"},
                            "embedding": {
                                "type": "knn_vector",  # Embedding field as dense vector
                                "dimension": 1536  # Dimension of embeddings matching OpenAI's embeddings
                            },
                            "metadata": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "text"},  # ID for FGA authentication
                                    "access": {"type": "text"}  # Access control
                                }
                            }
                        }
                    }
                })
        
        # Initialize embedding model
        embedding_model = OpenAIEmbeddings(model="text-embedding-ada-002")
        resume_vector_store = OpenSearchVectorStore(client, 'resumes', embedding_model)  
        posting_vector_store = OpenSearchVectorStore(client, 'postings', embedding_model) 

        return cls(resume_vector_store, posting_vector_store)

    def as_retriever(self):
        return self.store
