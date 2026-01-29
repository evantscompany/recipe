#schemas.comment.py

from pydantic import BaseModel
from datetime import datetime
from .user import UserOut # 유저정보 포함시키기 위해

#댓글 생성 시 받는 데이터
class CommentCreate(BaseModel):
    content: str
    post_id: int

#댓글 응답 시 보내는 데이터
class CommentOut(BaseModel):
    id: int
    content: str
    post_id: int
    user_id: int
    username: str
    created_at: datetime
    # author:UserOut #댓글 작성자 정보 포함

    class Config:
        from_attributes = True
    