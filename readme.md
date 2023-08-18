# Local Development Run
- Open Linux Terminal and execute the following command to create the virtual environment "virtualenv venv"
- Enter into the virtual environment using command: "source venv/bin/activate"
- Install the required python libraries usind command: "pip install -r requirements.txt"
- Run the command "python app.py" to start the application
- For Celery Workers we need to open new Linux terminal and get inside the virtual env and type "celery -A app.celery worker --loglevel INFO"
- For Celery Beat we need to open new Linux terminal and get inside the virtual env and type "celery -A app.celery beat --loglevel INFO"
- For Redis server we need to open new Linux terminal and get inside the virtual env and type "redis-server"

# Folder Structure

- `db_directory` has the sqlite DB. The path of the file can be adjusted in  ``application/config.py`.
- `application` contains the application code
- `static` - default `static` files folder. It serves at '/static' path to store files, images and css
- `static/dashboard.css` Custom CSS. You can edit it. Its empty currently
- `templates` - Default flask templates folder
The project structure is shown below:
.
└── Project Folder
    ├── docs
    │   └── report.pdf
    ├── application
    │   ├── api.py
    │   ├── config.py
    │   ├── controllers.py
    │   ├── database.py
    │   ├── task.py
    │   ├── validation.py
    │   └── workers.py
    ├── db_directory
    │   └── blogdb.sqlite3
    ├── templates
    │   └── index.html
    │   └── monthly_email.html
    │   └── reminder_email.html
    ├── static
    │   ├── Images (contains Images)
    │   ├── js (contains all vue js components)
    │   └── Uploads (contains all files that are uploaded via site)
    ├── app.py
    ├── requirements.txt
    └── readme.md
