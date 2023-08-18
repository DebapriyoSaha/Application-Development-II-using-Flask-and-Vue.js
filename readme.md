# Local Development Run
- Open Linux Terminal and execute the following command to create the virtual environment "virtualenv venv"
- Enter into the virtual environment using command: "source venv/bin/activate"
- Install the required python libraries usind command: "pip install -r requirements.txt"
- Run the command "python app.py" to start the application
- For Celery Workers we need to open new Linux terminal and get inside the virtual env and type "celery -A app.celery worker --loglevel INFO"
- For Celery Beat we need to open new Linux terminal and get inside the virtual env and type "celery -A app.celery beat --loglevel INFO"
- For Redis server we need to open new Linux terminal and get inside the virtual env and type "redis-server"
