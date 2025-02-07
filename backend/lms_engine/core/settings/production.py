from .base import *

DEBUG = False

SECRET_KEY = config("DJANGO_SECRET_KEY")

# TODO: Add hosts here
ALLOWED_HOSTS = CORS_ALLOWED_ORIGINS = ["192.168.1.67", "localhost"]
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

SECURE_SSL_REDIRECT = True

# TODO: Configure cache settings here

# TODO: Add email settings here

# TODO: Do some research before enabling this setting
# SECURE_HSTS_SECONDS = 31536000  # 1 year
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True

# TODO: Make sure we need this setting
# DATABASES["default"]["CONN_MAX_AGE"] = 300
# DATABASES["default"]["CONN_HEALTH_CHECKS"] = True

# TODO: Configure cache settings here

# TODO: Add email settings here
