# database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# 로컬 테스트용 (Railway 환경 변수가 우선순위를 가집니다)
load_dotenv()

# Railway Variables 탭에 설정한 이름과 정확히 일치해야 합니다.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# 디버깅을 위한 출력 (로그에서 확인 가능)
if not SQLALCHEMY_DATABASE_URL:
    # 만약 변수가 없으면 localhost를 시도하지 말고 명확한 에러를 냅니다.
    raise ValueError("❌ DATABASE_URL 환경 변수가 설정되지 않았습니다. Railway Variables를 확인하세요.")

print(f"🚀 연결하려는 DB 호스트: {SQLALCHEMY_DATABASE_URL.split('@')[-1] if '@' in SQLALCHEMY_DATABASE_URL else 'Unknown'}")

# 커넥션 풀 및 엔진 생성
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_recycle=3600,
    pool_pre_ping=True,
    echo=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) 

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()