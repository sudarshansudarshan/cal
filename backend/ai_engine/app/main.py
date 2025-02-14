from fastapi import FastAPI
from app.routers import question
from fastapi.staticfiles import StaticFiles 
from app.rag import app as rag_router

from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from fastapi.responses import HTMLResponse

from dotenv import load_dotenv
import os
from fastapi import Request
from fastapi.responses import JSONResponse


app = FastAPI(
    title="LLM Backend API",
    description=("A simple API for LLM-based tasks like question generation."),
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Load .env variables
load_dotenv()

# Include routers
app.include_router(question.router)
app.include_router(rag_router, prefix="/rag", tags=["RAG"])

app.mount("/static", StaticFiles(directory="app/static"),name="static")


@app.get("/", response_class=HTMLResponse)
def serve_homepage():
    index_path = Path("app/templates/index.html")
    return HTMLResponse(content=index_path.read_text(encoding="utf-8"))

@app.get("/login", response_class=HTMLResponse)
def login():
    # Add your login logic here
    # If login is successful, render the index.html page
    index_path = Path("app/templates/index.html")
    return HTMLResponse(content=index_path.read_text(encoding="utf-8"))


@app.post("/gettoken")
async def get_token(request: Request):
    data = await request.json()
    print("sun zaraaaaaa", data)
    token = data.get("token")
    print("tokkkk", token)
    if token:
        return JSONResponse(content={"message": "Token received", "token": token})
    return JSONResponse(content={"message": "Token not provided"}, status_code=400)

@app.get("/config")
def get_config():
    return {
        "LMS_GET_URL": os.getenv("LMS_GET_URL"),
        "VIDEO_UPLOAD_URL": os.getenv("VIDEO_UPLOAD_URL"),
        "ASSESSMENT_UPLOAD_URL": os.getenv("ASSESSMENT_UPLOAD_URL"),
        "QUESTIONS_UPLOAD_URL": os.getenv("QUESTIONS_UPLOAD_URL"),
        "Authorization": os.getenv("Authorization"),
    }
