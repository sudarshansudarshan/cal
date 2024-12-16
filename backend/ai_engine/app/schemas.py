from pydantic import BaseModel
from typing import List, Dict

# class QuestionGenerationRequest(BaseModel):
#     transcript: str

# class QuestionGenerationResponse(BaseModel):
#     question: str
#     options: List[str]
#     correct_answer: str

# class AnswerQuestionRequest(BaseModel):
#     question: str

# class AnswerQuestionResponse(BaseModel):
#     answer: str

# Pydantic Model for request data
class VideoRequest(BaseModel):
    url: str
    timestamps: List[int] #in seconds

# Pydantic Model for the output response
class Segment(BaseModel):
    text: str
    start_time: float
    end_time: float

class Question(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    segment: int

class VideoResponse(BaseModel):
    video_id: str
    title: str
    description: str
    segments: List[Dict]
    questions: List[Dict]
