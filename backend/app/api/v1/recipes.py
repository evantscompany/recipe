# recipes.py

from fastapi import APIRouter, Depends, Form, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.post import Post
from ..deps import get_current_user
from ...models import User
import uuid
import os
import app.schemas.post as RecipeDetailResponse
from app.schemas.post import PostDetail
from app.models.reaction import PostReaction


router = APIRouter()

#이미지가 실제 저장될 서버 폴더 경로
Upload_DIR = "app/static/uploads/"
if not os.path.exists(Upload_DIR):
    os.makedirs(Upload_DIR)

#1. 모든 레시피 목록 가져오기
@router.get("/")
def get_recipes(db: Session = Depends(get_db)):
    posts = db.query(Post).all()

    #각 포스트 객체에 실시간 좋아요 개수 달아주기
    for post in posts:
        post.like_count = db.query(PostReaction).filter(
            PostReaction.post_id == post.id,
            PostReaction.reaction_type == "like"
        ).count()
    return posts



#2. 특정 카테고리의 레시피 상세보기
@router.get("/{post_id}")
def get_recipe_detail(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="레시피를 찾을 수 없습니다")
    return post


#3. 레시피 생성하기
@router.post("/")
async def create_recipe(
    title:str = Form(...),
    content:str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user : User = Depends(get_current_user) #여기서 로그인 체크
):
    print(f"현재 서버 실행 위치 : {os.getcwd()}") #디버깅용
    print(f"현재 접속한 유저 : {current_user.username}") #디버깅용
    #1) 파일명 생성 : 유니크한 이름 뒤에 확장자 붙이기
    extension = image.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{extension}"
    file_path = os.path.join(Upload_DIR, unique_filename)
    
    #2) 파일 저장
    with open(file_path, "wb") as buffer:
        contents = await image.read()
        buffer.write(contents)
    
    #3) DB에 레시피 저장
    new_post = Post(
        title=title,
        content=content,
        image_url=f"/static/uploads/{unique_filename}", #DB에는 접근 가능한 URL 저장
        user_id=current_user.id #로그인한 유저의 ID를 자동으로 저장
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return {"message": "레시피가 성공적으로 생성되었습니다", "post": new_post.id}

#4. 레시피 삭제하기

@router.delete("/{post_id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    post_id: int,
    db: Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    #1. DB 에서 해당 레시피 조회
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="삭제할 레시피를 찾을 수 없습니다")

    #2. 레시피 작성자와 현재 유저가 같은지 확인
    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="레시피 삭제 권한이 없습니다")


    #3. 이미지 파일 삭제
    if post.image_url:
        relative_path = post.image_url.lstrip("/")
        file_path = os.path.join(os.getcwd(),"app", relative_path)

        if os.path.exists(file_path):
            os.remove(file_path)

    #4. DB에서 레시피 삭제
    db.delete(post)
    db.commit()

    return {"message": "레시피가 성공적으로 삭제되었습니다"}

#5. 레시피 수정하기
@router.put("/{post_id}")
async def update_recipe(
    post_id: int,
    title:str = Form(...),
    content:str = Form(...),
    image: UploadFile = File(None), #사진은 선택사항
    db: Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="수정할 레시피를 찾을 수 없습니다")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="레시피 수정 권한이 없습니다")
    
    #1. 텍스트 정보 업데이트
    post.title = title
    post.content = content  

    #2. 이미지 파일 업데이트 (선택사항)
    if image:
        #기존 이미지 파일 삭제
        if post.image_url:
            relative_path = post.image_url.lstrip("/")
            file_path = os.path.join(os.getcwd(),"app", relative_path)

            if os.path.exists(file_path):
                os.remove(file_path)
        
        #새 이미지 파일 저장
        extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{extension}"
        file_path = os.path.join(Upload_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            contents = await image.read()
            buffer.write(contents)
        
        #DB에 새로운 이미지 경로 저장
        post.image_url = f"/static/uploads/{unique_filename}"

    db.commit()
    db.refresh(post)
    return {"message": "레시피가 성공적으로 수정되었습니다", "post": post.id}    

@router.get("/{post_id}", response_model=PostDetail)
def get_post_detail(post_id: int, db: Session = Depends(get_db)):

    #1. 게시글과 관계된 데이터 (author,comments) 가져오기
    post = db.query(Post).filter(Post.id==post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    
    #2. like/dislike 개수 직접 쿼리해서 할당

    post.like_count = db.query(PostReaction).filter(
        PostReaction.post_id==post_id,
        PostReaction.reaction_type =="like"
    ).count()

    post.dislike_count = db.query(PostReaction).filter(
        PostReaction.post_id == post_id,
        PostReaction.reaction_type == "dislike"
    ).count()

    return post

# 6. 내가 작성한 레시피 목록만 가져오기
@router.get("/my/all") # 경로 충돌 피하기 위해 /my/all 로 설정
async def get_my_recipes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # 로그인 토큰 필수
):
    # 1) 현재 로그인한 유저의 ID로 필터링
    posts = db.query(Post).filter(Post.user_id == current_user.id).all()

    # 2) 각 포스트에 좋아요 개수 달아주기 (메인 페이지 로직과 동일)
    for post in posts:
        post.like_count = db.query(PostReaction).filter(
            PostReaction.post_id == post.id,
            PostReaction.reaction_type == "like"
        ).count()
        
    return posts