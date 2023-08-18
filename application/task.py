from application.workers import celery
from application.models import *
from celery.schedules import crontab
from flask import render_template
# import smtplib
from datetime import datetime
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# from email.mime.base import MIMEBase
# from email import encoders
import time, csv
from json import dumps
# from httplib2 import Http
from jinja2 import Template
from flask import current_app as app
from flask_mail import Message, Mail
from matplotlib import pyplot as plt
import numpy as np
import math
import pandas as pd

mail = Mail(app)

@celery.task()
def export_blog(blogID):    
    time.sleep(5)
    blog=Blog.query.filter_by(id=blogID).first()
    blog_title=blog.title
    blog_author= blog.user.fname + ' ' + blog.user.lname
    blog_time= blog.date_created
    blog_cat= blog.category
    blog_text = blog.content
    blog_likes = Like.query.filter_by(post_id=blogID).count()
    blog_comment = Comment.query.filter_by(post_id=blogID).count()
    head=['Title','Author','Blog Post Time','Category','Blog Content','No. of Likes','No. of Comment']
    row=[blog_title,blog_author,blog_time,blog_cat,blog_text,blog_likes,blog_comment]
    with open('./static/blog_data.csv','w') as file:
        csvwriter = csv.writer(file)
        csvwriter.writerow(head)
        csvwriter.writerow(row)
    return "Blog exporting started.."

@celery.task()
def blog_statistics(username,flag=False):
    current_user=User.query.filter_by(username=username).first()
    blog=Blog.query.filter_by(user_id=current_user.id).all()

    blog_dict={}
    title=[]
    category=[]
    date_created=[]
    total_likes=[]
    total_comments=[]
    blog_df=pd.DataFrame(columns=['title','category','date_created','total_likes','total_comments'])
    count=0
    for i in blog:
        title.append(i.title)
        category.append(i.category)
        date_created.append(i.date_created.strftime("%m/%d/%Y, %H:%M:%S"))
        l = Like.query.filter_by(post_id=i.id).count()
        total_likes.append(l)
        c = Comment.query.filter_by(post_id=i.id).count()
        total_comments.append(c)
        count+=1

    blog_dict={'Title':title,'Category':category,'Date_Created':date_created,'Total Likes':total_likes,'Total Comments':total_comments}   
       
    blog_df = pd.DataFrame(blog_dict).reset_index(drop=True)
    blog_df_html = blog_df.to_html

    if count==0:
        return "No blog found"
    
    
    fig = plt.figure(figsize = (5, 5))
 
    # creating the bar plot
    plt.bar(title, total_likes, color ='maroon', width=0.4)
    
    plt.xlabel("Blog Title")
    plt.ylabel("Total Likes")
    plt.title("Blog Title vs Total Likes")
    yint = range(min(total_likes), math.ceil(max(total_likes))+10)
    plt.yticks(yint)
    plt.savefig(f'./static/Images/blog_vs_likes{username}.png')

    fig = plt.figure(figsize = (5, 5)) 
    # creating the bar plot
    plt.bar(title, total_comments, color ='blue', width=0.4)
    
    plt.xlabel("Blog Title")
    plt.ylabel("Total Comments")
    plt.title("Blog Title vs Total Comments")
    yint = range(min(total_comments), math.ceil(max(total_comments))+10)
    plt.yticks(yint)
    plt.savefig(f'./static/Images/blog_vs_comments{username}.png')

    values = blog_df['Category'].value_counts().keys().tolist()
    counts = blog_df['Category'].value_counts().tolist()
    fig = plt.figure(figsize = (5, 5)) 
    plt.pie(np.array(counts), labels = values, autopct='%1.0f%%', pctdistance=1.1, labeldistance=1.2)
    plt.title("Category Piechart")
    plt.savefig(f'./static/Images/category_piechart{username}.png')

    plt.close()

    # for monthly reminder report generation
    if flag==True and count!=0:
        return ([blog_df,blog_dict])   

    return "Blog statistics generated"

@celery.task()
def monthly_reminder():
    user=User.query.all()
    # user=User.query.filter_by(username='debapriyo').all()
    for u in user:       
        try:
            res=blog_statistics(u.username,True)
            msg = Message(subject="Monthly Job Reminder",sender=("Debapriyo Saha",app.config.get("MAIL_USERNAME")),recipients=[u.email])
            message = format_message2("./templates/monthly_email.html",u.fname,u.timestamp.strftime("%m/%d/%Y, %H:%M:%S"),res[0],res[1],u.username)
            msg.html = message
            try:
                with app.open_resource(f"static/Images/blog_vs_likes{u.username}.png") as fp:
                    msg.attach(f"Blog vs Likes", "image/png", fp.read())
                with app.open_resource(f"static/Images/blog_vs_comments{u.username}.png") as fp:
                    msg.attach(f"Blog vs Comments", "image/png", fp.read())
                with app.open_resource(f"static/Images/category_piechart{u.username}.png") as fp:
                    msg.attach(f"Category Piechart", "image/png", fp.read())  
            except:
                pass 
            mail.send(msg)     
        except:
            pass            
            # msg.attach(f'./static/Images/blog_vs_likes{u.username}.png', 'image/png', open(f'./static/Images/blog_vs_likes{u.username}.png', 'rb').read())
            # msg.body = message            


def format_message2(template_file, data, t,blog_df,blog_dict,username):
    with open(template_file) as file_:
        template = Template(file_.read())
        return template.render(data = data, t=t, blog_df=blog_df, blog_dict=blog_dict,username=username)

# @celery.task()
# def send_reminder():
#     url="https://chat.googleapis.com/v1/spaces/AAAA_QOeH80/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=sSg60BaC0BuPn2FM-6RHS57juNlYFFAipBlePvFb5N0%3D"
#     bot_message={
#         'text':'Hello from Debapriyo'
#     }


#     message_headers={'Content-Type':'application/json; charset=UTF-8'}
#     http_obj = Http()
#     response = http_obj.request(
#         uri=url,
#         method='POST',
#         headers=message_headers,
#         body=dumps(bot_message)
#     )
#     return "Reminder will be sent shortly"


@celery.task()    
def daily_reminder():
    user=User.query.all()
    # user=User.query.filter_by(username='debapriyo').all()
    for u in user:
        if u.timestamp.date() < datetime.now().date():      
            msg = Message(subject="Daily Job Reminder",sender=("Debapriyo Saha",app.config.get("MAIL_USERNAME")),recipients=[u.email])
            message = format_message("./templates/reminder_email.html",u.fname,u.timestamp.strftime("%m/%d/%Y, %H:%M:%S"))
            msg.html = message
            # msg.body = message
            mail.send(msg)
def format_message(template_file, data, t):
    with open(template_file) as file_:
        template = Template(file_.read())
        return template.render(data = data, t=t)            


@celery.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    # sender.add_periodic_task(30, daily_reminder.s(), name='add every 10')

    # sender.add_periodic_task(crontab(minute=0, hour=21), daily_reminder.s(), name='mail every day at 9PM')
    sender.add_periodic_task(crontab(minute='*/10'), daily_reminder.s(), name='Daily Reminder every 10 mins')

    # sender.add_periodic_task(crontab(0, 0, day_of_month='2'), monthly_reminder.s(), name='Monthly Reminder every month')
    sender.add_periodic_task(crontab(minute='*/10'), monthly_reminder.s(), name='Monthly Reminder every 10 mins')    

