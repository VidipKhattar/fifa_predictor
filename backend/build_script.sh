# backend/build_script.sh

#!/bin/sh

echo "BUILD START"
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput --clear
echo "END START"

