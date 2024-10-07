from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "tutor-db")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    # UPLOAD_DIR 설정을 제거했습니다.

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()