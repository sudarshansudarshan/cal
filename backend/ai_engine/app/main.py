from fastapi import FastAPI, Request
from app.routers import question
from fastapi.staticfiles import StaticFiles 
from app.rag import app as rag_router

from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from fastapi.responses import HTMLResponse

from dotenv import load_dotenv
import os
from fastapi import FastAPI, Request, Response, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from pathlib import Path
from dotenv import load_dotenv
import os


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

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        access_token = request.cookies.get("access_token")

        # Inject token into Authorization header if available
        if access_token:
            request.headers.__dict__["_list"].append(
                ("authorization".encode(), f"Bearer {access_token}".encode())
            )

        response = await call_next(request)
        return response

# Add Middleware to FastAPI app
app.add_middleware(AuthMiddleware)


@app.post("/token")
async def store_token(request: Request, response: Response):
    data = await request.json()  # Get JSON payload from POST request
    access_token = data.get("access_token")  # Extract the token

    if not access_token:
        return JSONResponse(status_code=400, content={"error": "Access token is required"})

    # Set HttpOnly cookie for security (frontend can't access it)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # Prevents JavaScript from accessing the cookie
        secure=False,  # Set to True in production (requires HTTPS)
        samesite="Lax"  # Allows sharing between tabs but prevents CSRF
    )

    return {"message": "Access token stored successfully!"}


@app.get("/", response_class=HTMLResponse)
def serve_homepage():
    index_path = Path("app/templates/index.html")
    return HTMLResponse(content=index_path.read_text(encoding="utf-8"))

@app.get("/config")
async def get_config(request: Request):
    # Get the access token from cookies
    access_token = request.cookies.get("access_token")
    print("SUNO SUNO SUNO")
    print(access_token)
    
    # If the token is available, format it as a Bearer token
    authorization_header = f"{access_token}" if access_token else os.getenv("Authorization")

    return {
        "LMS_GET_URL": os.getenv("LMS_GET_URL"),
        "VIDEO_UPLOAD_URL": os.getenv("VIDEO_UPLOAD_URL"),
        "ASSESSMENT_UPLOAD_URL": os.getenv("ASSESSMENT_UPLOAD_URL"),
        "QUESTIONS_UPLOAD_URL": os.getenv("QUESTIONS_UPLOAD_URL"),
        "Authorization": authorization_header,
    }
