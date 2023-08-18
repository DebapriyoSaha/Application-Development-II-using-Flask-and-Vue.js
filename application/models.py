from .database import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_security import UserMixin,RoleMixin
from datetime import datetime

roles_users = db.Table('roles_users',
                       db.Column('user_id', db.Integer(),
                                 db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(),
                                 db.ForeignKey('role.id')))
class Follow(db.Model):
    __tablename__ = 'follow'
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'),primary_key=True)
    followed_id = db.Column(db.Integer, db.ForeignKey('user.id'),primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.now())

class User(db.Model,UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    fname = db.Column(db.String, unique=False, nullable=False)
    lname = db.Column(db.String, unique=False, nullable=False)
    profession = db.Column(db.String, unique=False, nullable=False)
    location = db.Column(db.String, nullable=False)
    image = db.Column(db.Text, nullable=False)
    username = db.Column(db.String, unique=True,nullable=False)
    password = db.Column(db.String,nullable=False)
    email = db.Column(db.String, unique=False,nullable=False)
    dob = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now())
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))
    user_blog = db.relationship('Blog',backref='user',cascade='all, delete-orphan', passive_deletes=True)
    likes = db.relationship('Like', backref='user',cascade='all, delete-orphan', passive_deletes=True)
    comments = db.relationship('Comment', backref='user',cascade='all, delete-orphan', passive_deletes=True)

    followed = db.relationship('Follow',foreign_keys=[Follow.follower_id],backref=db.backref('follower', lazy='joined'),lazy='dynamic',
                                        cascade='all, delete-orphan')
    followers = db.relationship('Follow',foreign_keys=[Follow.followed_id],backref=db.backref('followed', lazy='joined'),lazy='dynamic',
                            cascade='all, delete-orphan')     

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password) 

    def get_id(self):
        return self.id

    ### Follow and Unfollow ####
    def follow(self, user):
        if not self.is_following(user):
            f = Follow(follower=self, followed=user)
            db.session.add(f)

    def unfollow(self, user):
        f = self.followed.filter_by(followed_id=user.id).first()
        if f:
            db.session.delete(f)

    def is_following(self, user):
        return self.followed.filter_by(followed_id=user.id).first() is not None

    def is_followed_by(self,user):
        return self.followers.filter_by(follower_id=user.id).first() is not None    

    def followed_posts(self):
        return Blog.query.join(Follow, Follow.followed_id == Blog.user_id).filter(Follow.follower_id == self.id)        

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class Blog(db.Model,UserMixin):
    __tablename__ = 'blog'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer,db.ForeignKey("user.id", ondelete="CASCADE"))
    title = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    content = db.Column(db.Text, nullable=False)
    blog_file = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now())
    likes = db.relationship('Like', backref='blog', passive_deletes=True)
    comments = db.relationship('Comment', backref='blog', passive_deletes=True)

class Comment(db.Model):
    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime,default=datetime.now())
    user_id = db.Column(db.Integer,db.ForeignKey("user.id", ondelete="CASCADE"))
    post_id = db.Column(db.Integer, db.ForeignKey("blog.id", ondelete="CASCADE"))  

class Like(db.Model):
    __tablename__ = 'like'
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=datetime.now())
    user_id = db.Column(db.Integer,db.ForeignKey("user.id", ondelete="CASCADE"))
    post_id = db.Column(db.Integer, db.ForeignKey("blog.id", ondelete="CASCADE")) 

   
      