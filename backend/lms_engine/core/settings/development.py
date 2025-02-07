from .base import *  # noqa: F401

INSTALLED_APPS += [
    "drf_spectacular",
    "core.docs",
]

ALLOWED_HOSTS = ["localhost","192.168.1.67"]

CORS_ORIGIN_ALLOW_ALL = True

# TODO: Add email settings here
# Email Backend (Required for password reset and email verification)
EMAIL_HOST = "smtp.example.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "your_email@example.com"
EMAIL_HOST_PASSWORD = "your_password"
DEFAULT_FROM_EMAIL = "webmaster@example.com"

REST_FRAMEWORK.update({"DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema"})
