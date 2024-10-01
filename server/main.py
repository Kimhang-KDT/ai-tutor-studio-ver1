from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.database import init_db
from app.services.data_service import save_data
from typing import List
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 시작 시 실행될 코드
    try:
        await init_db()
        print("데이터베이스 초기화 성공")
    except Exception as e:
        print(f"데이터베이스 초기화 실패: {str(e)}")
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    yield
    # 종료 시 실행될 코드
    # 필요한 경우 여기에 정리 코드를 추가하세요

app = FastAPI(lifespan=lifespan)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Tutor Studio API"}

# 데이터 업로드 및 데이터셋 생성
@app.post("/data/create-dataset")
async def create_dataset(files: List[UploadFile] = File(...)):
    file_paths = await save_data(files)
    return {"filePaths": file_paths}

# 데이터셋 저장
@app.post("/data/save-dataset")
async def save_dataset():
    return {"message": "AI Tutor Studio API"}