# schemas.reaction.py

from pydantic import BaseModel
from typing import Literal

class ReactionUpdate(BaseModel):
    #Literal 타입을 사용하여 'like' 또는 'dislike'만 허용
    reaction_type: Literal['like', 'dislike']

class ReactionOut(BaseModel):
    like_count: int
    dislike_count: int 
    my_reaction : str | None = None # 사용자가 해당 포스트에 대해 어떤 반응을 했는지 나타냄

    class Config:
        from_attributes = True