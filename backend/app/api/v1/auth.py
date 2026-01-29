from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.core.security import create_access_token, verify_password, get_password_hash

router = APIRouter()

#[1] 회원가입 API

@router.post("/signup", response_model=UserOut)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    #이메일 중복체크
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일 입니다")
    
    #비밀번호 암호화 및 유저 생성
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email, 
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

#[2] 로그인 API(토큰 발급)
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    #oAuth2PasswordRequestForm의 username 필드는 이메일을 의미
    
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="잘못된 이메일 또는 비밀번호 입니다")
    
    #JWT 토큰 발급
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "username" : user.username #프론트에서 쓰기 편하게 유저이름 보내기
        }
