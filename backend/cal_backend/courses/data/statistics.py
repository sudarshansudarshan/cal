from dataclasses import dataclass

@dataclass
class Statistics:
    num_enrollments: int
    num_students_completed: int
    num_students_in_progress: int
    num_students_not_started: int
