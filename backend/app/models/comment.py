# comment.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now())
    
    #외래키 설정
    post_id = Column(Integer, ForeignKey('posts.id',ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id',ondelete="CASCADE"), nullable=False)   
    


    #게시글과의 관계 : "어느 게시물에 달린 댓글인지"
    post = relationship("Post", back_populates="comments")

    #유저와의 관계 : "어느 유저가 단 댓글인지"
    author = relationship("User", back_populates="comments")