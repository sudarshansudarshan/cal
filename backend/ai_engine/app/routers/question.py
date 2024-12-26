from fastapi import APIRouter
from app.schemas import (
    VideoRequest,
    VideoResponse
)
from app.services import process_process_video

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.post("/process_video")
def generate_question(request: VideoRequest):
    result = process_process_video(request.url, request.user_api_key, 
                                   request.timestamps, request.segment_wise_q_no, 
                                   request.segment_wise_q_model)
    return result

# @router.post("/answer", response_model=AnswerQuestionResponse)
# def answer_question(request: AnswerQuestionRequest):
#     answer = process_answer_question(request.question)
#     return {"answer": answer}
