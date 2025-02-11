from .base import *  # noqa: F401
import sentry_sdk

DEBUG = False

SECRET_KEY = os.getenv("CORE_ENGINE_DJANGO_SECRET_KEY")

# TODO: Add hosts here
ALLOWED_HOSTS = CORS_ALLOWED_ORIGINS = []

# TODO: Configure cache settings here

# TODO: Add email settings here
# Email Backend (Required for password reset and email verification)
EMAIL_HOST = "smtp.example.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "your_email@example.com"
EMAIL_HOST_PASSWORD = "your_password"
DEFAULT_FROM_EMAIL = "webmaster@example.com"

# Avoid transmitting cookies over HTTP accidentally
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

SECURE_SSL_REDIRECT = True

# TODO: Do some research before enabling this setting
# SECURE_HSTS_SECONDS = 31536000  # 1 year
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True

# TODO: Make sure we need this setting
DATABASES["default"]["CONN_MAX_AGE"] = 300
DATABASES["default"]["CONN_HEALTH_CHECKS"] = True


sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0,
    # TODO: Set this to a reasonable value
    profiles_sample_rate=0.3,
    send_default_pii=True
)
