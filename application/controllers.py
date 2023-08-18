from flask import Flask, request, flash, redirect, url_for, session, jsonify, Response, json, make_response,send_file
from flask import render_template
from flask import current_app as app
from datetime import timedelta, datetime
from sqlalchemy.exc import IntegrityError
from urllib.parse import urlparse,urljoin
from application.database import db
from sqlalchemy import or_
# from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash 
from application.models import *
from application import task
import secrets,string
from flask_caching import Cache
from celery.result import AsyncResult
import time,os
from flask_security import login_required,logout_user,login_user,current_user


cache = Cache(app)

# login_manager = LoginManager()
# login_manager.init_app(app)

# login_manager.login_view = 'login'

# @login_manager.user_loader
# def load_user(user_id):
# 	return User.query.get(int(user_id))

@app.route('/api/current_user/<string:username>',methods=['GET'])
# @login_required
# @cache.cached(timeout=6)
def get_current_user(username):
    current_user=User.query.filter_by(username=username).first()
    total_blogs = Blog.query.filter_by(user_id=current_user.id).count()
    total_followers = current_user.followers.filter_by(followed_id=current_user.id).count()
    total_following = current_user.followed.filter_by(follower_id=current_user.id).count()

    total_followers_all = current_user.followers.filter_by(followed_id=current_user.id).all()
    total_following_all = current_user.followed.filter_by(follower_id=current_user.id).all()

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

    user_data = {
        'id': current_user.id,
        'username': current_user.username,
        'fname': current_user.fname,
        'lname': current_user.lname,
        'email': current_user.email,
        'dob': current_user.dob,
        'image': current_user.image,
        'profession' : current_user.profession,
        'location':current_user.location,
        'total_blogs':total_blogs,
        'total_followers':total_followers,
        'total_following':total_following,
    }
    return jsonify({'user_data':user_data,'total_followers_all':total_followers_dict,'total_following_all':total_following_dict}) 


@app.route("/", methods=["GET","POST"])
def home():
    return render_template("index.html")

@app.route("/user_login", methods=["GET","POST"])
def login():
    login_form=request.get_json()
    user= User.query.filter_by(username=login_form.get('username')).first()
    if user is not None:
        if user.check_password(login_form.get('password')):
            login_user(user)
            session['username']=user.username 
            if request.args.get('include_auth_token'):
                auth_token = current_user.get_auth_token()           
            return jsonify({'msg1':"Success",'msg2':user.username,'auth_token':user.fs_uniquifier})
        else:
            return jsonify({'msg1':"Failed",'msg2':"Incorrect Password"})
    else:
        return jsonify({'msg1':"Failed",'msg2':"Not a valid Username or Email"})                


@app.route('/user_register', methods=['POST'])
def register():
  
    user = User.query.filter_by(email=request.form.get('email')).first()   
    if user is None:
        user = User.query.filter_by(username=request.form.get('username')).first()
        if user is None:
            hashed_pw = generate_password_hash(request.form.get('password'), "sha256")
            if request.files.get('image') is None:
                dest_path = "../static/Images/default_dp.png"
            else:
                img = request.files.get('image')
                dest_path=f'static/Uploads/{img.filename}' 
                img.save(dest_path)
                dest_path=f'../static/Uploads/{img.filename}'

            key=''.join(secrets.choice(string.ascii_uppercase + string.digits) for i in range(256))
            user = User(username=request.form.get('username').lower(), fname=request.form.get('firstname'), lname=request.form.get('lastname'),profession=request.form.get('profession'),
                            image=dest_path,password=hashed_pw, email=request.form.get('email').lower(), location=request.form.get('location'), dob=request.form.get('dob'),
                            active=True,fs_uniquifier=key)            
            try:
                db.session.add(user)
                db.session.commit()
                return jsonify({'msg1':"Success",'msg2':"User Registered Successfully"})
            except:
                db.session.rollback()
                return jsonify({'msg1':"Failed",'msg2':"Database insertion failed. Try Again !"}) 
        else:
            return jsonify({'msg1':"Failed",'msg2':"Username Already Exists"})
    else:
            return jsonify({'msg1':"Failed",'msg2':"Email Already Exists"})

@app.route("/delete_profile/<string:username>", methods=['GET', 'POST'])
# @login_required
def delete_profile(username):
    
    user = User.query.filter_by(username=username).first()
    comment = Comment.query.filter_by(user_id=user.id).all()
    like = Like.query.filter_by(user_id=user.id).all()    

    try:
        for i in comment:
            db.session.delete(i)
        for j in like:
            db.session.delete(j)

        db.session.delete(user)
        db.session.commit()
        return jsonify({'msg1':"Success",'msg2':"User Deleted Successfully"})
    except:
        db.session.rollback()
        return jsonify({'msg1':"Failed",'msg2':"Database Deletion failed. Try Again !"})


@app.route("/edit_profile/<string:username>", methods=['GET', 'POST']) 
# @login_required   
def edit_profile(username):

    user = User.query.filter_by(username=username).first()
    if user.email!=request.form.get('email'):
        u = User.query.filter_by(email=request.form.get('email')).first()
        if u is not None:
                return jsonify({'msg1':"Failed",'msg2':"Email Already Exists"})
    
    else:      
        if request.files.get('image') is not None:
            img = request.files.get('image')
            dest_path=f'static/Uploads/{img.filename}' 
            img.save(dest_path)
            dest_path=f'../static/Uploads/{img.filename}'
            user.image = dest_path

        if request.form.get('firstname') is not None:
            user.fname = request.form.get('firstname')
        if request.form.get('lastname') is not None:
            user.lname = request.form.get('lastname')
        if request.form.get('profession') is not None:
            user.profession = request.form.get('profession')
        if request.form.get('location') is not None:
            user.location = request.form.get('location')
        if request.form.get('dob') is not None:
            user.dob = request.form.get('dob') 
        if request.form.get('email') is not None:
            user.email = request.form.get('email')          
           
        try:
            db.session.add(user)
            db.session.commit()
            return jsonify({'msg1':"Success",'msg2':"Profile Updated Successfully"})
        except:
            db.session.rollback()
            return jsonify({'msg1':"Failed",'msg2':"Database insertion failed. Try Again !"}) 

@app.route('/add_post/<string:username>', methods=['GET', 'POST'])
# @login_required
def add_post(username):   
    
    user=User.query.filter_by(username=username).first()
    if user.id is None:
        return jsonify({'msg1':'Failure','msg2':'User not logged in'})

    blog_title=request.form.get('title')
    blog_cat=request.form.get('category')
    blog_text= request.form.get('content')
    blog_img = request.files.get('image')
    dest_path=f'static/Uploads/{blog_img.filename}' 
    blog_img.save(dest_path)
    dest_path=f'../static/Uploads/{blog_img.filename}'

    post = Blog(title=blog_title, content=blog_text, user_id=user.id, blog_file=dest_path, category=blog_cat, date_created=datetime.now(),user=user)
    try:
        db.session.add(post)
        db.session.commit()
        return jsonify({'msg1':'Success','msg2':'Post added successfully'})
    except:
        db.session.rollback()
        return jsonify({'msg1':'Fail','msg2':'There was a problem adding post, try again...'})

@app.route('/get_blog/<int:blog_id>', methods=['GET', 'POST'])
# @login_required
def get_blog(blog_id):
    b = Blog.query.filter_by(id=blog_id).first()
    blog_dict={}
    blog_dict['title']=b.title
    blog_dict['content']=b.content
    blog_dict['category']=b.category
    blog_dict['blog_file']=b.blog_file
    return jsonify(blog_dict)       


@app.route('/edit_post/<int:blog_id>', methods=['GET', 'POST'])
# @login_required
def edit_post(blog_id): 

    blog = Blog.query.filter_by(id=blog_id).first()

    blog_title=request.form.get('title')
    blog_cat=request.form.get('category')
    blog_content= request.form.get('content')
    blog_img = request.files.get('image')

    if blog_title != blog.title:
        blog.title=blog_title

    if blog_cat != blog.category:
        blog.category= blog_cat

    if blog_content != blog.content:
        blog.content=blog_content

    if blog_img is not None:
        dest_path=f'static/Uploads/{blog_img.filename}' 
        blog_img.save(dest_path)
        dest_path=f'../static/Uploads/{blog_img.filename}'
        blog.blog_file = dest_path
    
    try:
        db.session.add(blog)
        db.session.commit()
        return jsonify({'msg1':'Success','msg2':'Blog edited successfully !!!!!'})
    except :
        return jsonify({'msg1':'Fail','msg2':'Blog edit was unsuccessful, try again!!!!!'})

@app.route('/delete_post/<int:blog_id>', methods=['GET', 'POST'])
# @login_required
def delete_post(blog_id):

    blog = Blog.query.filter_by(id=blog_id).first()
    comment = Comment.query.filter_by(post_id=blog_id).all()

    like = Like.query.filter_by(post_id=blog_id).all()


    try:
        for i in comment:
            db.session.delete(i)
        for j in like:
            db.session.delete(j)
        db.session.delete(blog)
        db.session.commit()
        return jsonify({'msg1':'Success','msg2':'Post deleted successfully'})
    except:
        db.session.rollback()
        return jsonify({'msg1':'Fail','msg2':'There was a problem deleting post, try again...'})


@app.route("/like_post/<string:username>/<blog_id>", methods=["GET", "POST"])
# @login_required
def like(username,blog_id):
    current_user=User.query.filter_by(username=username).first()
    blog = Blog.query.filter_by(id=blog_id).first()
    like = Like.query.filter_by(user_id=current_user.id, post_id=blog_id).first()
    if not blog:
        return jsonify({'error': 'Post does not exist.'}, 400)

    elif like:
        try:
            db.session.delete(like)   
            db.session.commit()
            return jsonify({"likes": len(blog.likes), "liked": current_user.id in map(lambda x: x.user_id, blog.likes)})
        except:
           return jsonify({'error': 'Not able to unlike the post at this moment. Try Again !!!'}, 400)     

    else:
        try:
            like = Like(user_id=current_user.id, post_id=blog_id,blog=blog)        
            db.session.add(like)                
            db.session.commit()
            return jsonify({"likes": len(blog.likes), "liked": current_user.id in map(lambda x: x.user_id, blog.likes)})
        except:    
            return jsonify({'error': 'Not able to like the post at this moment. Try Again !!!'}, 400)    
 

@app.route('/add_comment/<string:username>/<int:blog_id>', methods=['POST'])
# @login_required
def add_comment(username,blog_id):
    current_user=User.query.filter_by(username=username).first()    
    data = request.get_json()   
    blog = Blog.query.filter_by(id=blog_id).first() 
    
    comment = Comment(text=data.get("comment_text"), user_id=current_user.id, post_id=blog_id, date_created=datetime.now(), blog=blog)

    try:
        db.session.add(comment)         
        db.session.commit()
        return jsonify("Comment Added Succesfully")
    except:
        db.session.rollback()
        return jsonify("There was a problem adding comment, try again...")

@app.route('/delete_comment/<comment_id>', methods=['GET','POST'])
# @login_required
def delete_comment(comment_id):  
    
    comment = Comment.query.filter_by(id=comment_id).first() 
    try:
        db.session.delete(comment) 
        db.session.commit() 
        return jsonify("Comment Deleted Successfully")                      
    except:
        db.session.rollback()
        return jsonify("There was a problem deleting comment, try again...")        
    

@app.route('/following/<string:current_username>/<string:username>', methods=['GET', 'POST'])
# @login_required
def follow(current_username,username):
    current_user=User.query.filter_by(username=current_username).first()
    user = User.query.filter_by(username=username).first()

    # if current_user.followed.filter_by(followed_id=user.id).first() is None:
    if user.is_following(user) == False:
        f = Follow(follower=current_user, followed=user, timestamp=datetime.now())
        try:
            db.session.add(f)
            db.session.commit()
            return jsonify({'msg1':'Success','msg2':'Followed Successfully'})
        except:
            db.session.rollback()
            return jsonify({'msg1':'Fail','msg2':'Not able to follow at this moment. Try Again'}) 


@app.route('/followers/<string:current_username>/<string:username>', methods=['GET', 'POST'])
# @login_required
def unfollow(current_username,username):
    current_user=User.query.filter_by(username=current_username).first()
    user = User.query.filter_by(username=username).first()
    if user.is_followed_by(user) == False:
        f = current_user.followed.filter_by(followed_id=user.id).first()
        if f:
            try:
                db.session.delete(f)
                db.session.commit()
                return jsonify({'msg1':'Success','msg2':'Unfollowed Successfully'})
            except:
                db.session.rollback()
                return jsonify({'msg1':'Fail','msg2':'Not able to unfollow at this moment. Try Again'})
                
@app.route("/search/<string:username>/<value>", methods=["GET","POST"])
# @login_required
def search(username,value):
    search_lst=[]
    search_user="%{}%".format(value)
    search_result = User.query.filter(or_(User.username.like(search_user),User.fname.like(search_user),User.lname.like(search_user))).all()
    for i in search_result:
        search_dict={}
        if i.username != username:
            search_dict['fname']=i.fname
            search_dict['lname']=i.lname
            search_dict['username']=i.username
            search_dict['image']=i.image
            search_dict['profession']=i.profession
            search_dict['location']=i.location
            search_dict['id']=i.id
            search_lst.append(search_dict)

    return jsonify(search_lst)
    
@app.route('/user_logout/<string:username>', methods=['GET', 'POST'])
# @login_required
def logout(username):
    current_user=User.query.filter_by(username=username).first()
    session.clear()
    current_user.timestamp=datetime.now()
    try:
        db.session.add(current_user)
        db.session.commit()        
        logout_user()
        return jsonify ("Logged Out Successfully !!!")

    except:
        db.session.rollback()
        return jsonify ("Not able to logout at this moment. Try Again !!!")


@app.route('/export_blog/<int:blogID>',methods=['GET','POST'])
def export_blog(blogID):
    a= task.export_blog.delay(blogID)
    x=a.wait()
    return {
        'task_id': a.id,
        "task_state": a.state,
        "task_result": a.result
    }  

@app.route('/blog_statistics/<string:username>', methods=['GET', 'POST'])
def statistics(username):
    a = task.blog_statistics.delay(username)
    x=a.wait()  
    return {
        'task_id': a.id,
        "task_state": a.state,
        "task_result": a.result
    } 

# @app.route('/get_status/<task_id>')
# def get_status(task_id):
#     task = AsyncResult(task_id)
#     return {
#         'task_id': task.id,
#         "task_state": task.state,
#         "task_result": task.result
#     }


@app.route('/download-file')
def download_file():
    return send_file('./static/blog_data.csv')
    
           
# @app.errorhandler(404)
# def page_not_found(e):
# 	return render_template("404.html"), 404

# @app.errorhandler(500)
# def page_not_found(e):
# 	return render_template("500.html"), 500    
