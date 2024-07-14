# backend/Dockerfile

# Use official Python image as a base
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /code

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    git \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /code/

# Copy entrypoint.sh and set executable permissions
COPY ./entrypoint.sh /code/entrypoint.sh
RUN chmod +x /code/entrypoint.sh

ENV DJANGO_SETTINGS_MODULE=fifa_predictor.settings 

# Use entrypoint.sh as the entry point
ENTRYPOINT ["/code/entrypoint.sh"]

# Command to run the application
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "fifa_predictor.asgi:application"]
