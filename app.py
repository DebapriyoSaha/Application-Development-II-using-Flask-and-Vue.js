import os
from flask import Flask
from application import config
from application.config import LocalDevelopmentConfig
from flask_restful import Resource, Api
from application.database import db
from application.models import *
from flask_ckeditor import CKEditor
from flask_security import Security, SQLAlchemyUserDatastore
import application.workers as workers
from flask_mail import Mail
import time
from flask_caching import Cache

app = None
api = None
celery = None

def create_app():
    app = Flask(__name__, template_folder="templates")
    ckeditor = CKEditor(app)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    sec = Security()
    sec.init_app(app, user_datastore)
    api = Api(app) 
    mail=Mail(app)   
    app.app_context().push()

    #Create Celery
    celery = workers.celery
    celery.conf.update(
      broker_url = app.config["CELERY_BROKER_URL"],
      result_backend = app.config["CELERY_RESULT_BACKEND"]
    )
    celery.Task = workers.ContextTask
    cache=Cache(app)
    app.app_context().push()

    return app, api, celery,mail,cache

app, api, celery, mail,cache = create_app()


# Import all the controllers so they are loaded
from application.controllers import *

# Add all restful controllers
from application.api import UserAPI, DashboardAPI, UserBlogAPI
api.add_resource(UserAPI, "/api/user", "/api/user/<string:username>")
api.add_resource(DashboardAPI, "/api/dashboard", "/api/dashboard/<string:username>")
api.add_resource(UserBlogAPI, "/api/profile", "/api/profile/<string:username>")

if __name__ == '__main__':
  # Run the Flask app
  # db.create_all()
  app.run(host='0.0.0.0',port=8080)