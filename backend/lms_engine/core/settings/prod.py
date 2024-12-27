from .base import *  # noqa: F401

DEBUG = False

# TODO: Add hosts here
ALLOWED_HOSTS = []

# TODO: Add origins here
CORS_ALLOWED_ORIGINS = []

# TODO: Add email settings here
# Email Backend (Required for password reset and email verification)
EMAIL_HOST = "smtp.example.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "your_email@example.com"
EMAIL_HOST_PASSWORD = "your_password"
DEFAULT_FROM_EMAIL = "webmaster@example.com"
