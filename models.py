from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, Table
from sqlalchemy.orm import declarative_base, relationship
from werkzeug.security import generate_password_hash, check_password_hash

Base = declarative_base()
USER_UID_KEY = 99

# pip install alembic
# alembic init.
# pip install -e .
# touch models.py
# alembic init migrations
# alembic revision --autogenerate -m "Create user model"
# alembic upgrade heads
# flask --debug run
# flask --app personal --debug run


PostLike = Table(
    "post_likes",
    Base.metadata,
    Column("post_id", ForeignKey("posts.id", ondelete="CASCADE")),
    Column("user_id", ForeignKey("user.id")),
)


class UserModel(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    uuid = Column(String(100), unique=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(Text, nullable=False)
    created = Column(DateTime, default=datetime.utcnow)
    postLikes = relationship('Post', secondary=PostLike, lazy='subquery', backref='user')

    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(
            password,
            method='sha256'
        )

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

    def set_uuid(self):
        """Create uuid."""
        self.uuid = self.username + '.' + str(int(self.id) + int(USER_UID_KEY))


# class PostLike(Base):
#     __tablename__ = 'post_likes'
#
#     user_id = Column(Integer, ForeignKey("user.id"))
#     post_id = Column(Integer, ForeignKey("posts.id"))

class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True)
    uuid = Column(Text, unique=True)
    author_id = Column(Integer, ForeignKey("user.id"))
    is_public = Column(Boolean, nullable=True)
    title = Column(String(50), nullable=False)
    body = Column(Text, nullable=False)
    created = Column(DateTime, default=datetime.utcnow)

    def __init__(self, title, body, uuid, author_id):
        self.title = title
        self.body = body
        self.uuid = uuid
        self.author_id = author_id


class PostComment(Base):
    __tablename__ = 'post_comments'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))
    body = Column(Text(500), nullable=False)
    created = Column(DateTime, default=datetime.utcnow)


class PostImage(Base):
    __tablename__ = 'post_images'

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    name = Column(String(100), nullable=False)
    created = Column(DateTime, default=datetime.utcnow)
