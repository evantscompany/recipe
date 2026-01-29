#comment.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.comment import Comment
from ..deps import get_current_user
from app.schemas.comment import CommentCreate,CommentOut
from app.models.user import User
from app.models.post import Post
router = APIRouter()

#1. 댓글 작성하기
@router.post("/", response_model=CommentOut)
def create_comment(
    # post_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    
):
    # print(f"--- Incoming PostID :{post_id}---") #디버깅용
    # print(f"--- Data : {comment_data.dict()}")  #디버깅용
    #게시글 존재 여부 확인
    existing_post=db.query(Post).filter(Post.id==comment_data.post_id).first()
    if not existing_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="댓글을 달 게시글을 찾을 수 없습니다.")
    
    #댓글 객체 생성
    new_comment = Comment(
        content=comment_data.content,
        post_id=comment_data.post_id,
        user_id=current_user.id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    new_comment.username = current_user.username
    return new_comment

#2. 댓글 수정하기
@router.put("/{comment_id}", response_model=CommentOut)
def update_comment(
    comment_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    #댓글 존재 여부 확인
    existing_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not existing_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="수정할 댓글을 찾을 수 없습니다.")
    
    #댓글 작성자 확인
    if existing_comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="댓글을 수정할 권한이 없습니다.")
    
    #댓글 내용 업데이트
    existing_comment.content = comment_data.content
    db.commit()
    db.refresh(existing_comment)
    existing_comment.username = current_user.username
    return existing_comment

#3. 댓글 삭제하기
@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    #댓글 존재 여부 확인
    existing_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not existing_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="삭제할 댓글을 찾을 수 없습니다.")

    #댓글 작성자 확인
    if existing_comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="댓글을 삭제할 권한이 없습니다.")

    db.delete(existing_comment)
    db.commit()
    return {"detail": "댓글이 성공적으로 삭제되었습니다."}

# [4] 특정 게시글의 모든 댓글 조회하기
@router.get("/post/{post_id}", response_model=list[CommentOut])
def get_comments_by_post(post_id: int,db: Session = Depends(get_db)):
    results = db.query(Comment,User.username).join(
        User,Comment.user_id == User.id
    ).filter(Comment.post_id == post_id).all()
    return [
        {
            "id": c.id,
            "content": c.content,
            "post_id": c.post_id,
            "user_id": c.user_id,
            "created_at": c.created_at,
            "username": uname  # 여기서 '유저 1' 대신 'somang', 'gemini' 같은 진짜 이름이 들어감!
        }

        for c , uname in results]