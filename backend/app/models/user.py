# user.py

from sqlalchemy import Column, Integer, String
from app.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    posts= relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments= relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    reactions= relationship("PostReaction", back_populates="user", cascade="all, delete-orphan")