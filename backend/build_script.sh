#!/bin/sh

echo "BUILD START"
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput --clear
echo "BUILD END"

# Run Django development server
daphne -b 0.0.0.0 -p 8000 fifa_predictor.asgi:application
