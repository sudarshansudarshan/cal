from datetime import datetime

from ..data.assessment_progress import AssessmentProgress


def deserialize_assessment_progress(progress_json):
    return AssessmentProgress(
        assessment_id=progress_json['assessment_id'],
        last_accessed=datetime.fromisoformat(progress_json['last_accessed']),
        score=progress_json['score'],
        assessment_data=progress_json['assessment_data'],
        submission_date=datetime.fromisoformat(progress_json['submission_date']),
        init_access_date=datetime.fromisoformat(progress_json['initAccessDate']),
        is_completed=progress_json['is_completed']
    )

def validate_assessment_progress(progress: AssessmentProgress):
    if progress.is_completed:
        if not progress.score:
            raise ValueError("Score should not be None if assessment is completed.")
        if not progress.submission_date:
            raise ValueError("Submission date should not be None if assessment is completed.")
        if not progress.assessment_data:
            raise ValueError("Assessment data should not be None if assessment is completed.")

        if not progress.submission_date > progress.init_access_date:
            raise ValueError("Submission date should be greater than initial access date.")
    
        if not progress.last_accessed >= progress.init_access_date:
            raise ValueError("Last accessed should be greater than or equal to initial access date.")
        
        if not progress.last_accessed >= progress.submission_date:
            raise ValueError("Last accessed should be greater than or equal to submission date.")

    else:
        if progress.score:
            raise ValueError("Score should be None if assessment is not completed.")
        if progress.submission_date:
            raise ValueError("Submission date should be None if assessment is not completed.")
        if progress.assessment_data:
            raise ValueError("Assessment data should be None if assessment is not completed.")
    
        if not progress.last_accessed == progress.init_access_date:
            raise ValueError("Assessment should not be accessed after viewing and before submitting.")

def get_last_accessed_assessment(progress_list: list[AssessmentProgress]) -> datetime:
    return max(progress_list, key=lambda progress: progress.last_accessed).last_accessed