"""Database models."""
from uuid import uuid4

from email_split import email_split
from flask_login import UserMixin
from sqlalchemy import func
from werkzeug.security import check_password_hash, generate_password_hash

from . import db

USER_UID_KEY = 9999999999


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=False)
    email = db.Column(db.String(40), unique=True, nullable=False)
    password = db.Column(db.String(200), primary_key=False, unique=False, nullable=False)
    website = db.Column(db.String(60), index=False, unique=False, nullable=True)
    uuid = db.Column(db.String(32), default=lambda: str(uuid4().hex), unique=True)
    created_on = db.Column(db.DateTime, index=False, unique=False, nullable=True)
    last_login = db.Column(db.DateTime, index=False, unique=False, nullable=True)

    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password, method="sha256")

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

    def set_uuid(self):
        """Create uuid."""
        email = email_split(self.email)
        email.local  # zahid
        email.domain  # gmail.com
        self.uuid = email.local + '.' + str(int(self.id) + int(USER_UID_KEY))

    def __repr__(self):
        return "<User {}>".format(self.name)


class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(32), default=lambda: str(uuid4().hex), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    is_public = db.Column(db.Boolean, nullable=True)
    title = db.Column(db.String(50), nullable=False)
    body = db.Column(db.Text, nullable=False)
    created = db.Column(db.DateTime, server_default=func.now())

    def __repr__(self, title, body, user_id):
        self.title = title
        self.body = body
        self.user_id = user_id


class PostComment(db.Model):
    __tablename__ = 'post_comments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"))
    body = db.Column(db.Text, nullable=False)
    created = db.Column(db.DateTime, server_default=func.now())


class PostImage(db.Model):
    __tablename__ = 'post_images'

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"))
    name = db.Column(db.String(100), nullable=False)
    created = db.Column(db.DateTime, server_default=func.now())


class PostLike(db.Model):
    __tablename__ = 'post_likes'

    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
