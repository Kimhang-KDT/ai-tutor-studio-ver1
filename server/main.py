from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.database import init_db
from app.services.data_service import save_data, get_data_lists_from_db, save_dataset_to_db
from app.services.llm_service import translate_data  # structure_json_data 제거
from typing import List, Dict
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
async def create_dataset(file: UploadFile = File(...)):
    try:
        dataset = await translate_data(file)
        if "error" in dataset:
            return {"error": dataset["error"]}
        return {"dataset": dataset}
    except Exception as e:
        print(f"데이터셋 생성 중 오류 발생: {str(e)}")
        return {"error": f"데이터셋 생성 중 오류 발생: {str(e)}"}

# 데이터셋 저장
@app.post("/data/save-dataset")
async def save_dataset(dataset: Dict):
    try:
        # 데이터베이스에 저장
        result = await save_dataset_to_db(dataset)
        
        if result == "dataset saved":
            return {"success": True, "message": "데이터셋이 성공적으로 저장되었습니다."}
        else:
            raise HTTPException(status_code=500, detail="데이터셋 저장 실패")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"데이터셋 저장 중 오류 발생: {str(e)}")

# 저장한 데이터셋 목록 조회
@app.get("/lists")
async def data_lists():
    # 데이터베이스에서 저장된 데이터셋을 불러와 클라이언트로 반환
    data_lists = await get_data_lists_from_db()

    return {"message": "AI Tutor Studio API"}