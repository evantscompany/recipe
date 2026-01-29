# reaction.py

from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

# 좋아요,싫어요 등의 반응을 나타내는 모델
class PostReaction(Base):
    __tablename__ = "post_reactions"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id",ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id",ondelete="CASCADE"), nullable=False)
    
    #like,dislike, etc. 저장
    reaction_type = Column(String(20), nullable=False)  # e.g., 'like', 'love', 'haha', etc.

    __table_args__ = (
        UniqueConstraint('post_id', 'user_id', name='unique_post_user_reaction'),
    )

    post = relationship("Post", back_populates="reactions")
    user = relationship("User", back_populates="reactions")