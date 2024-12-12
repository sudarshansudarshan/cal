from .constants import DEFAULT_MAX_LEN


def truncate_text(text, max_length=DEFAULT_MAX_LEN, truncate='...'):
    if len(text) > max_length:
        return text[:max_length - len(truncate)] + truncate
    return text
