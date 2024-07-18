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

"""DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}"""

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "render_lger",
        "USER": "render_lger_user",
        "PASSWORD": "4jS4nrZTQDLo5SSkcZibTv0kAzUfYnCj",
        "HOST": "dpg-cqcfmq88fa8c73cp7l7g-a.singapore-postgres.render.com",
        "PORT": "5432",
    }
}


STATIC_URL = "static/"
STATICFILES_DIRS = os.path.join(BASE_DIR, "static")
# STATIC_ROOT = BASE_DIR / "staticfiles"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles_build", "static")
