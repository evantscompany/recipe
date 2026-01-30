from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.models import user, post, comment
from app.api.v1 import auth , recipes
from app.api.v1 import comment as comment_router
from app.api.v1 import reaction as reaction_router
from fastapi.middleware.cors import CORSMiddleware
import os


# print(f"서버가 static을 찾는 실제 주소: {os.path.abspath('app/static')}")
# 위의 코드는 디버깅용


#DB테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(title='Cooking Recipe API')


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://fabulous-caring-production.up.railway.app", # 방금 만든 프론트 주소
    "http://localhost:3000", # 로컬 테스트용
]




# 3. CORS 설정 적용
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # 허용할 출처
    allow_credentials=True,         # 쿠키/인증정보 허용 여부
    allow_methods=["*"],             # 모든 HTTP 메서드(GET, POST 등) 허용
    allow_headers=["*"],             # 모든 헤더 허용
)


app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(recipes.router, prefix="/api/v1/recipes", tags=["recipes"])
app.include_router(comment_router.router, prefix="/api/v1/comments", tags=["comments"])
app.include_router(reaction_router.router, prefix="/api/v1/reactions", tags=["reactions"])
app.mount("/static", StaticFiles(directory="app/static"), name="static")



@app.get("/")
def read_root():
    return {"message": "Welcome to the Cooking Recipe API!"}
