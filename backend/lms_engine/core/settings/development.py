from .base import *  # noqa: F401

INSTALLED_APPS += [
    "drf_spectacular",
    "core.docs",
]

ALLOWED_HOSTS = ["localhost","192.168.1.67"]

CORS_ORIGIN_ALLOW_ALL = True

REST_FRAMEWORK.update({"DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema"})
