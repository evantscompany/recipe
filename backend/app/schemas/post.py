#schemas.post.py

from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.schemas.user import UserOut
from app.schemas.comment import CommentOut 

class RecipeDetailResponse(BaseModel):
    id: int
    title: str
    content: str
    image_url: Optional[str] = None
    category: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime]
    user_id: int

    author: UserOut

    class Config:
        from_attributes = True

# 1. 기본 게시글 정보 (목록 조회 등 공통으로 사용)
class PostOut(BaseModel):
    id: int
    title: str
    content: str
    image_url: Optional[str] = None
    category: Optional[str] = None  # 필요한 경우 추가
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: int

    class Config:
        from_attributes = True

# 2. 상세 조회용 (PostOut을 상속받아 확장)
class PostDetail(PostOut):
    author: UserOut
    comments: List[CommentOut] = []  # 댓글 리스트 포함
    like_count: int=0
    dislike_count: int=0
    class Config:
        from_attributes = True