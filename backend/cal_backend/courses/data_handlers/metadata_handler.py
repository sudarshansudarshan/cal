from django.forms import ValidationError

from ..constants import *
from ..data import Metadata

def deserialize_course_metadata(metadata_json) -> Metadata:
    return Metadata(**metadata_json)

def validate_course_metadata(metadata: Metadata):
    if len(metadata.description) > COURSE_DESCRIPTION_MAX_LEN:
        raise ValidationError(f'Description must be at most {COURSE_DESCRIPTION_MAX_LEN} characters long')


    if any(len(tag) > COURSE_TAG_MAX_LEN for tag in metadata.tags):
        raise ValidationError(f'Tags must be at most {COURSE_TAG_MAX_LEN} characters long')
