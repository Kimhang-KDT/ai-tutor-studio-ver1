from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.DATABASE_URL)
db = client.tutor_db

async def init_db():
    try:
        await client.admin.command('ping')
        print("데이터베이스에 성공적으로 연결되었습니다.")
    except Exception as e:
        print(f"데이터베이스 연결 실패: {e}")