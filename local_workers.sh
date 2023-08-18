echo "==================================================================="
echo "Starting local workers"

# Activate virtual env
# . .env/bin/activate
# export ENV=development
python3 -m celery -A app.celery worker -l info

# python3 -m celery -A reminders worker -l INFO --detach –
# deactivate