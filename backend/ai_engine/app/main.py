from fastapi import FastAPI
from app.routers import question
from app.rag import app as rag_router

app = FastAPI(
    title="LLM Backend API",
    description="A simple API for LLM-based tasks like question generation and answering.",
    version="1.0.0",
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(question.router)
app.include_router(rag_router, prefix="/rag", tags=["RAG"])

from pathlib import Path
from fastapi.responses import HTMLResponse
@app.get("/", response_class=HTMLResponse)
def serve_homepage():
    index_path = Path("app/templates/index.html")
    return HTMLResponse(content=index_path.read_text(encoding="utf-8"))