import os
from fastapi import UploadFile
from typing import List, Dict
from app.core.config import settings
import json
from app.db.database import db, save_dataset, get_dataset, get_dataSets, update_dataset

async def save_data(files: List[UploadFile]) -> List[str]:
    file_paths = []
    for file in files:
        try:
            file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
            print(f"Trying to save file: {file_path}")
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            file_paths.append(file_path)
            print(f"File saved successfully: {file_path}")
        except Exception as e:
            print(f"Error saving file {file.filename}: {str(e)}")
            raise
    
    return file_paths

async def save_dataset_to_db(dataset: Dict):
    try:
        inserted_id = await save_dataset(dataset)
        if inserted_id:
            return inserted_id  # 문자열로 변환된 ObjectId 반환
        else:
            raise Exception("데이터셋 저장 실패")
    except Exception as e:
        print(f"데이터셋 저장 중 오류 발생: {str(e)}")
        raise

async def get_data_lists_from_db():
    data_lists = await get_dataSets()
    return data_lists

    return "dataset saved"

async def get_dataset_from_db(dataset_id: str):
    try:
        dataset = await get_dataset(dataset_id)
        return dataset
    except Exception as e:
        print(f"데이터셋 조회 중 오류 발생: {str(e)}")
        raise

async def update_dataset_in_db(dataset_id: str, dataset: Dict):
    try:
        # _id 필드 제거 (MongoDB가 자동으로 관리)
        if '_id' in dataset:
            del dataset['_id']
        updated = await update_dataset(dataset_id, dataset)
        if updated:
            return await get_dataset(dataset_id)  # 업데이트된 데이터셋 반환
        else:
            return None
    except Exception as e:
        print(f"데이터셋 업데이트 중 오류 발생: {str(e)}")
        raise


