from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.models import user, post, comment
from app.api.v1 import auth, recipes
from app.api.v1 import comment as comment_router
from app.api.v1 import reaction as reaction_router
from fastapi.middleware.cors import CORSMiddleware
import os

# 1. DB 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(title='Cooking Recipe API')

# 2. CORS 설정 (배포된 프론트엔드 주소가 모두 포함되어야 함)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://fabulous-caring-production.up.railway.app", # 현재 사용 중인 프론트 주소
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. 정적 파일 경로 설정 (절대 경로 방식 사용)
# 현재 파일(main.py) 위치를 기준으로 app/static 폴더를 찾습니다.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_path = os.path.join(BASE_DIR, "app", "static")

# 배포 서버에 폴더가 없을 경우를 대비해 생성
if not os.path.exists(static_path):
    os.makedirs(static_path, exist_ok=True)

# 4. 라우터 등록
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(recipes.router, prefix="/api/v1/recipes", tags=["recipes"])
app.include_router(comment_router.router, prefix="/api/v1/comments", tags=["comments"])
app.include_router(reaction_router.router, prefix="/api/v1/reactions", tags=["reactions"])

# 5. 정적 파일 서빙 (CORS 대응이 필요할 수 있으므로 절대 경로 적용)
app.mount("/static", StaticFiles(directory=static_path), name="static")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Cooking Recipe API!"}