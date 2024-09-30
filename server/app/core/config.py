from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    LLM_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()