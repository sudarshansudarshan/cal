from django.core.validators import URLValidator
from django.forms import ValidationError

from cal_backend.courses.constants import VIDEO_TITLE_MAX_LEN
from cal_backend.courses.data.video import Video

def deserialize_video(video_json):
    return Video(**video_json)

def validate_video(video: Video):
    if len(video.title) > VIDEO_TITLE_MAX_LEN:
            raise ValidationError(f'Video title must be at most {VIDEO_TITLE_MAX_LEN} characters long')

    try:
        URLValidator()(video.source)
    except ValidationError:
        raise ValidationError('Video source must be a valid URL')