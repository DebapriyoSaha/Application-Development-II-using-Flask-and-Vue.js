from flask import Flask, jsonify, json
from flask import current_app as app
from flask import render_template, request, redirect, url_for, make_response
from application.validation import BusinessValidationError, NotFoundError
from application.models import *
import os
from application.database import db
from datetime import datetime
# import jwt
from flask_security import login_required
from flask_caching import Cache
# from flask_security import auth_required, auth_token_required
# from flask_jwt_extended import create_access_token, unset_access_cookies
# from flask_jwt_extended import get_jwt_identity, get_jwt
# from flask_jwt_extended import jwt_required

from werkzeug.wrappers import response

from flask_cors import CORS
from flask_restful import Resource
from flask_restful import Api
from flask_restful import fields
from flask_restful import marshal_with
from flask_restful import reqparse

# from workers import celery

from flask_sqlalchemy import SQLAlchemy

from werkzeug.exceptions import HTTPException

create_user_parser = reqparse.RequestParser()
create_user_parser.add_argument('username')
create_user_parser.add_argument('first_name')
create_user_parser.add_argument('last_name')
create_user_parser.add_argument('email_id')
create_user_parser.add_argument('location')
create_user_parser.add_argument('profession')
create_user_parser.add_argument('mobile')


update_user_parser = reqparse.RequestParser()
update_user_parser.add_argument('email')

resource_fields = {
    'user_id': fields.Integer,
    'fname':  fields.String,
    'lname': fields.String,
    'email':   fields.String,
    'location': fields.String,
    'profession': fields.String,
    'mobile': fields.Integer
}

CORS(app)
api = Api(app)
cache = Cache(app)


class UserAPI(Resource):
    @marshal_with(resource_fields)
    def get(self, username):
        user = db.session.query(User).filter(User.username == username).first()
        if user is None:
            raise NotFoundError(status_code=404)
        return user
    @marshal_with(resource_fields)
    def put(self,username):
        args = create_user_parser.parse_args()
        fname = args.get("first_name",None)
        lname = args.get("last_name",None)
        email = args.get("email_id",None)
        location = args.get("location",None)
        profession = args.get("profession",None)
        mobile = args.get("mobile",None)
        user = db.session.query(User).filter(User.username == username).first()
        if user is None:
            raise NotFoundError(status_code=404)

        db.session.query(User).where(User.username==username).update({User.fname : fname, User.lname :lname ,User.profession:profession,User.email:email,
        User.location:location,User.mobile:mobile},synchronize_session=False)
        db.session.commit()   
        return user

    def delete(self,username):
        user = db.session.query(User).filter(User.username == username).first()
        if user is None:
            raise NotFoundError(status_code=404)
        db.session.delete(user)
        db.session.commit()
        return "Successfully Deleted"

    def post(self):
        args = create_user_parser.parse_args()
        username = args.get("username",None)
        fname = args.get("first_name",None)
        lname = args.get("last_name",None)
        email = args.get("email_id",None)
        location = args.get("location",None)
        profession = args.get("profession",None)
        mobile = args.get("mobile",None)
        user = db.session.query(User).filter(User.username == username).first()
        if user is None:
            raise NotFoundError(status_code=404)

        db.session.query(User).where(User.username==username).update({User.fname : fname, User.lname :lname ,User.profession:profession,User.email:email,
        User.location:location,User.mobile:mobile},synchronize_session=False)
        db.session.commit()   
        return user   

class DashboardAPI(Resource):
    def __init__(self):
        self.t = None

    def time_calc(self,date_created):
        self.t="1 second ago"
        if (datetime.now() - date_created).days == 1:
            self.t = str((datetime.now() - date_created).days) + " day ago"

        elif (datetime.now() - date_created).days > 1:
            self.t = str((datetime.now() - date_created).days) + " days ago"

        elif (datetime.now() - date_created).total_seconds() / 3600 == 1:
            self.t = str(((datetime.now() - date_created).days * 24 + (datetime.now() - date_created).seconds) // 3600) + " hour ago" 

        elif (datetime.now() - date_created).total_seconds() / 3600 > 1:
            self.t = str(((datetime.now() - date_created).days * 24 + (datetime.now() - date_created).seconds) // 3600) + " hours ago"            

        elif ((datetime.now() - date_created).total_seconds() / 3600 < 1) and ((datetime.now() - date_created).seconds % 3600 // 60 >= 1) :
            self.t = str((datetime.now() - date_created).seconds % 3600 // 60) + " minutes ago"

        elif ((datetime.now() - date_created).seconds % 3600 // 60 < 1) and ((datetime.now() - date_created).seconds % 60 > 0) :
            self.t = str((datetime.now() - date_created).seconds % 60) + " seconds ago"
  

    # @login_required
    # @cache.cached(timeout=5)
    def get(self,username):
        all_blogs=[] 
        c_user={}       
        current_user=User.query.filter_by(username=username).first()
        blogs= current_user.followed_posts().all()
        
        c_user['user_id']=current_user.id
        c_user['username']=current_user.username
        c_user['fname']=current_user.fname
        c_user['lname']=current_user.lname
        c_user['profession']=current_user.profession
        c_user['location']=current_user.location
        c_user['email']=current_user.email
        c_user['image']=current_user.image
        c_user['total_blogs']=Blog.query.filter_by(user_id=current_user.id).count()
        c_user['total_followers']=current_user.followers.filter_by(followed_id=current_user.id).count()
        c_user['total_following']=current_user.followed.filter_by(follower_id=current_user.id).count()

        for b in blogs:
            all_comments=[]
            blog_dict={}
            blog_dict['blog_id'] = b.id
            blog_dict['blog_title']=b.title
            blog_dict['author_username']= b.user.username
            blog_dict['author_fname']= b.user.fname
            blog_dict['author_lname']= b.user.lname
            blog_dict['author_img']=b.user.image
            self.time_calc(b.date_created)
            blog_dict['blog_post_time'] = self.t
            blog_dict['blog_category']= b.category
            blog_dict['blog_content']= b.content
            blog_dict['blog_file']= b.blog_file
            
            comments = Comment.query.filter_by(post_id=b.id).all()

            for c in comments:
                comm_dict={}
                comm_dict['comm_id'] = c.id
                comm_dict['comm_fname'] = c.user.fname
                comm_dict['comm_lname'] = c.user.lname
                comm_dict['comm_username'] = c.user.username
                comm_dict['comm_image'] = c.user.image
                self.time_calc(c.date_created)
                comm_dict['comm_post_time'] = self.t
                comm_dict['comm_content']= c.text
                all_comments.append(comm_dict)
            blog_dict['blog_comments'] = all_comments 

            likes = Like.query.filter_by(post_id=b.id).all()
            count = 0
            for l in likes:
                count+=1
                if l.user_id == current_user.id:
                    blog_dict['user_liked']=True

            blog_dict['like_counts']=count               

            all_blogs.append(blog_dict)

        return {"blogs":[all_blogs],"current_user":c_user}     


class UserBlogAPI(Resource):
    
    def __init__(self):
        self.t= None

    
    def time_calc(self,date_created):
        self.t="1 second ago"
        if (datetime.now() - date_created).days == 1:
            self.t = str((datetime.now() - date_created).days) + " day ago"

        elif (datetime.now() - date_created).days > 1:
            self.t = str((datetime.now() - date_created).days) + " days ago"

        elif (datetime.now() - date_created).total_seconds() / 3600 == 1:
            self.t = str(((datetime.now() - date_created).days * 24 + (datetime.now() - date_created).seconds) // 3600) + " hour ago" 

        elif (datetime.now() - date_created).total_seconds() / 3600 > 1:
            self.t = str(((datetime.now() - date_created).days * 24 + (datetime.now() - date_created).seconds) // 3600) + " hours ago"
            

        elif ((datetime.now() - date_created).total_seconds() / 3600 < 1) and ((datetime.now() - date_created).seconds % 3600 // 60 >= 1) :
            self.t = str((datetime.now() - date_created).seconds % 3600 // 60) + " minutes ago"

        elif ((datetime.now() - date_created).seconds % 3600 // 60 < 1) and ((datetime.now() - date_created).seconds % 60 > 0) :
            self.t = str((datetime.now() - date_created).seconds % 60) + " seconds ago" 

    
    def get(self,username):
        all_blogs=[]
        user=User.query.filter_by(username=username).first()
        total_blogs= Blog.query.filter_by(user_id=user.id).count()
        total_followers = user.followers.filter_by(followed_id=user.id).count()
        total_following = user.followed.filter_by(follower_id=user.id).count()
        
        total_followers_lst = user.followers.filter_by(followed_id=user.id).all()
        total_following_lst = user.followed.filter_by(follower_id=user.id).all()

        lst1=[]
        for i in total_followers_lst:
            lst1.append(i.follower_id)

        
        lst2=[]
        for i in total_following_lst:
            lst2.append(i.followed_id)

            
        user_data = {
        'id': user.id,
        'username': user.username,
        'fname': user.fname,
        'lname': user.lname,
        'email': user.email,
        'image': user.image,
        'timestamp': str(user.timestamp),
        'profession': user.profession,
        'location': user.location,
        'total_blogs': total_blogs,
        'total_followers': total_followers,
        'total_following': total_following,
        'followers_id_list': lst1,
        'following_id_list': lst2
        }
        blogs= Blog.query.filter_by(user_id=user.id).order_by(Blog.date_created.desc()).all()
        
        for b in blogs:
            all_comments=[]
            blog_dict={}
            blog_dict['blog_id'] = b.id
            blog_dict['blog_title']=b.title
            blog_dict['author_username']= b.user.username
            blog_dict['author_fname']= b.user.fname
            blog_dict['author_lname']= b.user.lname
            blog_dict['author_img']=b.user.image
            self.time_calc(b.date_created)
            blog_dict['blog_post_time'] = self.t
            blog_dict['blog_category']= b.category
            blog_dict['blog_content']= b.content
            blog_dict['blog_file']= b.blog_file
            
            comments = Comment.query.filter_by(post_id=b.id).all()
            for c in comments:
                comm_dict={}
                comm_dict['comm_id'] = c.id
                comm_dict['comm_fname'] = c.user.fname
                comm_dict['comm_lname'] = c.user.lname
                comm_dict['comm_username'] = c.user.username
                comm_dict['comm_image'] = c.user.image
                self.time_calc(c.date_created)
                comm_dict['comm_post_time'] = self.t
                comm_dict['comm_content']= c.text
                all_comments.append(comm_dict)
            blog_dict['blog_comments'] = all_comments 

            likes = Like.query.filter_by(post_id=b.id).all()
            count = 0
            for l in likes:
                count+=1
                if l.user_id == user.id:
                    blog_dict['user_liked']=True

            blog_dict['like_counts']=count               

            all_blogs.append(blog_dict)


        total_followers_all = user.followers.filter_by(followed_id=user.id).all()
        total_following_all = user.followed.filter_by(follower_id=user.id).all()

        total_followers_dict=[]
        total_following_dict=[]

        for i in total_followers_all:
            temp={}
            temp['username']=i.follower.username
            temp['fname']=i.follower.fname
            temp['lname']=i.follower.lname
            temp['id']=i.follower.id
            temp['profession']=i.follower.profession
            temp['location']=i.follower.location
            temp['image']=i.follower.image
            total_followers_dict.append(temp)


        for i in total_following_all:
            temp={}
            temp['username']=i.followed.username
            temp['fname']=i.followed.fname
            temp['lname']=i.followed.lname
            temp['id']=i.followed.id
            temp['profession']=i.followed.profession
            temp['location']=i.followed.location
            temp['image']=i.followed.image
            total_following_dict.append(temp)  
    

        return {"blogs":[all_blogs],"user_data":user_data,'total_followers_all':total_followers_dict,'total_following_all':total_following_dict}
