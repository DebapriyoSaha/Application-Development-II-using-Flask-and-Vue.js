echo "==================================================================="
echo "Starting local beat"

# Activate virtual env
# . .env/bin/activate
# export ENV=development
# python3 -m celery -A main.celery beat --max-interval 1 -l info
python3 -m celery -A app.celery beat --max-interval 1 -l info
# deactivate