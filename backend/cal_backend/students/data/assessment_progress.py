from dataclasses import dataclass
from datetime import datetime

@dataclass
class AssessmentProgress:
    assessment_id: int
    score: float | None
    assessment_data: dict | None
    last_accessed: datetime
    submission_date: datetime | None
    init_access_date: datetime
    is_completed: bool
