from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_experimental.text_splitter import SemanticChunker
from langchain_community.vectorstores import FAISS
from langchain.llms.base import BaseLLM
from langchain.schema import Generation, LLMResult, Document
from langchain.chains import RetrievalQA
from langchain.chains.llm import LLMChain
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.prompts import PromptTemplate
from typing import List, Optional, Any
import google.generativeai as genai
from typing import Any, List, Optional
import faiss
from langchain.docstore import InMemoryDocstore
import os
import json

app = APIRouter()

# Initialize components
embeddings = HuggingFaceEmbeddings()
#VECTOR_STORE_PATH = "faiss_index"
VECTOR_STORE_PATH = "faiss_index"
METADATA_FILE = "metadata.json"
text_splitter = SemanticChunker(embeddings)

if os.path.exists(VECTOR_STORE_PATH):
    vector_store = FAISS.load_local(VECTOR_STORE_PATH, embeddings, allow_dangerous_deserialization=True)
else:
    # Create an empty FAISS index
    sample_embedding = embeddings.embed_query("test input")
    embedding_dimension = len(sample_embedding)
    index = faiss.IndexFlatL2(embedding_dimension)
    docstore = InMemoryDocstore({})
    index_to_docstore_id = {}
    vector_store = FAISS(
        index=index,
        embedding_function=embeddings,
        docstore=docstore,
        index_to_docstore_id=index_to_docstore_id,
    )

# Load or create FAISS index
# sample_embedding = embedding_model.embed_query("test input")
# embedding_dimension = len(sample_embedding)
# index = faiss.IndexFlatL2(embedding_dimension)
# Load or create FAISS index
# if os.path.exists(VECTOR_STORE_PATH):
#     vector_store = FAISS.load_local(VECTOR_STORE_PATH)
# else:
#     # Create an empty FAISS index
#     index = faiss.IndexFlatL2(embedding_dimension)
#     vector_store = FAISS(index)

# docstore = InMemoryDocstore({})
# index_to_docstore_id = {}

# # Initialize FAISS vector store
# vector_store = FAISS(
#     index=index,
#     embedding_function = embedding_model,
#     docstore=docstore,
#     index_to_docstore_id=index_to_docstore_id,
# )

# Load or initialize metadata
if os.path.exists(METADATA_FILE):
    with open(METADATA_FILE, "r") as f:
        metadata = json.load(f)
else:
    metadata = {}


genai.configure(api_key="AIzaSyA3lMgPrIAHmHzHuD6lqisGeJiwDxPVWss")
model = genai.GenerativeModel("gemini-1.5-flash")
# Define the GenAIWrapper
class GenAIWrapper(BaseLLM):
    model: Any  # Do not use Field(...) here, as it conflicts with Pydantic's validation

    def __init__(self, model: Any, **kwargs):
        """Initialize the wrapper with the underlying GenAI model."""
        super().__init__(**kwargs)
        self.model = model

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        """Simplified single-shot call method."""
        response = self.model.generate_text(prompt)
        return response.text  # Ensure this returns the text output

    def _generate(
        self,
        prompts: List[str],
        stop: Optional[List[str]] = None,
        **kwargs: Any
    ) -> LLMResult:
        """Handles batched prompts and returns results in LangChain's standard format."""
        generations = []
        for prompt in prompts:
            response = self.model.generate_content(prompt)  # Adjust the method name if necessary
            generations.append(Generation(text=response.text))

        # Wrap results in LangChain's LLMResult object
        return LLMResult(generations=[generations])

    @property
    def _llm_type(self) -> str:
        return "genai"


wrapped_model = GenAIWrapper(model=model)

# Create prompts and chains
prompt = """
1. Use the following pieces of context to provide a detailed explanation in response to the student's query.
2. If you don't know the answer, say "I don't know" without making up an answer.
3. Make sure to break down the explanation in a clear, student-friendly manner, using simple language. Aim to help the student understand the topic better.
Context: {context}
Question: {question}
Detailed Explanation: """

QA_CHAIN_PROMPT = PromptTemplate.from_template(prompt)
llm_chain = LLMChain(llm=wrapped_model, prompt=QA_CHAIN_PROMPT, verbose=True)

document_prompt = PromptTemplate(
    input_variables=["page_content", "source"],
    template="Context:\ncontent:{page_content}\nsource:{source}",
)
combine_documents_chain = StuffDocumentsChain(
    llm_chain=llm_chain,
    document_variable_name="context",
    document_prompt=document_prompt,
)

qa_chain = RetrievalQA(
    combine_documents_chain=combine_documents_chain,
    retriever=vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 3}),
    return_source_documents=True,
    verbose=True,
)

# Endpoint for uploading PDF files
@app.post("/upload/")
async def upload_text(text: str = Form(...)):
    try:
        # Split the input text into chunks
        docs = [Document(page_content=text)]  # Create a single document from the input text
        documents = text_splitter.split_documents(docs)  # Split text into smaller chunks

        # Add documents to FAISS vector store
        global vector_store  # Ensure we're modifying the global variable
        if vector_store is None:
            vector_store = FAISS.from_documents(documents, embeddings)
        else:
            vector_store.add_documents(documents)

        # Update metadata
        metadata["text_input"] = [doc.page_content for doc in documents]
        with open(METADATA_FILE, "w") as f:
            json.dump(metadata, f)

        # Save FAISS index
        vector_store.save_local(VECTOR_STORE_PATH)

        return JSONResponse({"message": "PDF uploaded and processed successfully."})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# Endpoint for querying the system
@app.post("/query/")
async def query_rag(question: str = Form(...)):
    try:
        # Run the QA chain with the prompt
        output = qa_chain({"query": question})

        # Extract the desired outputs
        result = output.get("result", "No result generated.")
        source_documents = output.get("source_documents", [])

        # Format source documents for the response
        sources = [
            {"page_content": doc.page_content, "source": doc.metadata.get("source", "unknown")}
            for doc in source_documents
        ]

        return JSONResponse({"response": result, "sources": sources})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# Endpoint to check metadata
@app.get("/metadata/")
async def get_metadata():
    return metadata
