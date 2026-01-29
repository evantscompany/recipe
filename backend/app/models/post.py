# post.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    category = Column(String(50), index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    images = relationship("PostImage", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan") 
    author = relationship("User", back_populates="posts")
    reactions = relationship("PostReaction", back_populates="post", cascade="all, delete-orphan")



class PostImage(Base):
    __tablename__ = 'post_images'

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey('posts.id'))
    image_url = Column(String(500), nullable=False)

    post = relationship("Post", back_populates="images")