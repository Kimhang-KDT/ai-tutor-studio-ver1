import os
from fastapi import UploadFile
from typing import List
from app.core.config import settings

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

async def save_dataset_to_db():
    pass

    return "dataset saved"

async def get_data_lists_from_db():
    pass

    return "dataset saved"

async def get_dataset_from_db():
    pass

    return "dataset saved"


