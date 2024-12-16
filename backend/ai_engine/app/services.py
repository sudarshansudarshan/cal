from app.models import process_video
from app.schemas import VideoRequest
from typing import List

# def process_question_generation(transcript: str):
#     return generate_question(transcript)

# def process_answer_question(question: str):
#     return answer_question(question)

def process_process_video(url: str, timestamps: List[int]):
    return process_video(url, timestamps)
# Compare this snippet from app/routers/video.py:  
# from fastapi import APIRouter
# from app.schemas import VideoRequest, VideoResponse
# from app.services import process_video
#