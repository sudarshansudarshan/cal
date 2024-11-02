from dataclasses import dataclass
from datetime import datetime

from .assessment_progress import AssessmentProgress

@dataclass
class ChapterProgress:
    chapter_id: int
    last_accessed: datetime
    assessment_progress: list[AssessmentProgress]
