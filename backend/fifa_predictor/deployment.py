import os
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = [os.environ["WEBSITE_HOSTNAME"]]
CSRF_TRUSTED_ORIGINS = ["https://" + os.environ["WEBSITE_HOSTNAME"]]
DEBUG = False
SECRET_KEY = os.environ["MY_SECRET_KEY"]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    # add here
    "http://localhost:8000",
]

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "railway",
        "USER": "postgres",
        "PASSWORD": "NaoBDlexjgQaIpIvCXljZMAdTLJGgFZp",
        "HOST": "roundhouse.proxy.rlwy.net",
        "PORT": "21311",
    }
}


AWS_ACCESS_KEY_ID = "AKIA2UC27F2PI3KJ3E52"
AWS_SECRET_ACCESS_KEY = "ClGVMcwMgGUtcHc+Suwpi5hj2+Q8Y/SXIjR/Gik7"
AWS_STORAGE_BUCKET_NAME = "samplele-bucket"
AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"
# AWS_S3_SIGNATURE_NAME = "s3v4"
AWS_S3_REGION_NAME = "ap-southeast-2"
AWS_DEFAULT_ACL = None

AWS_S3_URL_PROTOCOL = "https"
AWS_S3_USE_SSL = True
AWS_S3_VERIFY = True

STATIC_URL = f"{AWS_S3_URL_PROTOCOL}://{AWS_S3_CUSTOM_DOMAIN}/static/"
STATICFILES_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

MEDIA_URL = f"{AWS_S3_URL_PROTOCOL}://{AWS_S3_CUSTOM_DOMAIN}/media/"
DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"


STATIC_URL = "static/"
STATICFILES_DIRS = os.path.join(BASE_DIR, "static")
# STATIC_ROOT = BASE_DIR / "staticfiles"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles_build", "static")
