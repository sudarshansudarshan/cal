from fastapi import FastAPI
from app.routers import question

app = FastAPI(
    title="LLM Backend API",
    description="A simple API for LLM-based tasks like question generation and answering.",
    version="1.0.0",
)

# Include routers
app.include_router(question.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the LLM Backend API!"}
