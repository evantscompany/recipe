#reaction.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.reaction import PostReaction
from app.models.post import Post
from app.schemas.reaction import ReactionUpdate, ReactionOut
from ..deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/{post_id}/reaction", response_model=ReactionOut)
def update_reaction(
    post_id: int,
    reaction_in: ReactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    #1. 게시글 존재여부 확인
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    
    #2. 기존 반응 확인
    existing_reaction = db.query(PostReaction).filter(
        PostReaction.post_id == post_id,
        PostReaction.user_id == current_user.id
    ).first()

    if existing_reaction:
        #3. 기존 반응이 존재하면 업데이트
        if existing_reaction.reaction_type == reaction_in.reaction_type:
            #같은걸 또 누르면 취소
            db.delete(existing_reaction)
            db.commit()
        else:
            #다른 걸 누르면 변경
            existing_reaction.reaction_type = reaction_in.reaction_type
            db.commit()

    else:
        #4. 기존 반응이 없으면 새로 생성
        new_reaction = PostReaction(
            post_id=post_id,
            user_id=current_user.id,
            reaction_type=reaction_in.reaction_type
        )
        db.add(new_reaction)
        db.commit()

    # 최신 카운트 계산해서 반환
    likes = db.query(PostReaction).filter(
        PostReaction.post_id == post_id,PostReaction.reaction_type == 'like'
    ).count()
    dislikes = db.query(PostReaction).filter(
        PostReaction.post_id == post_id,PostReaction.reaction_type == 'dislike'
    ).count()

    return{
        "like_count": likes,
        "dislike_count": dislikes,
        "my_reaction": reaction_in.reaction_type if existing_reaction is None or existing_reaction.reaction_type != reaction_in.reaction_type else None
    }