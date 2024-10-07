from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.database import init_db, JSONEncoder, get_collection
from app.services.data_service import get_data_lists_from_db, save_dataset_to_db, get_dataset_from_db, update_dataset_in_db
from app.services.llm_service import translate_data, create_new_model, check_fine_tuning_status, update_model_status, use_fine_tuned_model
from typing import List, Dict
import os
import json
from fastapi.responses import JSONResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_db()
        print("데이터베이스 초기화 성공")
    except Exception as e:
        print(f"데이터베이스 초기화 실패: {str(e)}")
    # UPLOAD_DIR 관련 코드를 제거했습니다.
    yield

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
        id = await save_dataset_to_db(dataset)
        if id:
            return {"success": True, "message": "데이터셋이 성공적으로 저장되었습니다.", "id": id}
        else:
            raise HTTPException(status_code=500, detail="데이터셋 저장 실패")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"데이터셋 저장 중 오류 발생: {str(e)}")

# 저장한 데이터셋 목록 조회
@app.get("/data/datasets")
async def data_lists():
    data_lists = await get_data_lists_from_db()
    return JSONResponse(content={"data_lists": data_lists})

# 데이터셋 조회
@app.get("/data/dataset/{dataset_id}")
async def get_dataset(dataset_id: str):
    try:
        dataset = await get_dataset_from_db(dataset_id)
        if dataset:
            return JSONResponse(content=dataset)
        else:
            raise HTTPException(status_code=404, detail="데이터셋을 찾을 수 없습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"데이터셋 조회 중 오류 발생: {str(e)}")

# 데이터셋 수정 및 업데이트
@app.put("/data/dataset/{dataset_id}")
async def update_dataset_route(dataset_id: str, dataset: Dict):
    try:
        updated = await update_dataset_in_db(dataset_id, dataset)
        if updated:
            return {"success": True, "message": "데이터셋이 성공적으로 업데이트되었습니다."}
        else:
            raise HTTPException(status_code=404, detail="데이터셋을 찾을 수 없습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"데이터셋 업데이트 중 오류 발생: {str(e)}")

@app.post("/model/newModel")
async def create_new_model_route(dataset_id: str = Body(..., embed=True)):
    dataset = await get_dataset_from_db(dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="데이터셋을 찾을 수 없습니다.")
    
    new_model = await create_new_model(dataset)
    return {"model_id": new_model["model_id"], "status": new_model["status"]}

@app.get("/model/status/{model_id}")
async def get_model_status(model_id: int):
    models_collection = await get_collection("models")
    model = await models_collection.find_one({"model_id": model_id})
    if not model:
        raise HTTPException(status_code=404, detail="모델을 찾을 수 없습니다.")
    
    current_status = await check_fine_tuning_status(model["fine_tuning_id"])
    if current_status != model["status"]:
        await update_model_status(model_id, current_status)
    
    return {"status": current_status}

@app.get("/model/status-by-dataset/{dataset_id}")
async def get_model_status_by_dataset(dataset_id: str):
    models_collection = await get_collection("models")
    model = await models_collection.find_one({"dataset_id": dataset_id})
    if not model:
        return {"status": "미생성"}
    
    # OpenAI API를 통해 최신 상태 확인 및 DB 업데이트
    current_status = await update_model_status(model["fine_tuning_id"])
    return {"status": current_status}

@app.post("/model/use/{dataset_id}")
async def use_model(dataset_id: str, prompt: str = Body(...)):
    try:
        response = await use_fine_tuned_model(dataset_id, prompt)
        return {"response": response}
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

