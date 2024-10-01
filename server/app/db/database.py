from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.DATABASE_URL)
db = client[settings.MONGODB_DB_NAME]

async def init_db():
    try:
        await client.admin.command('ping')
        print("데이터베이스에 성공적으로 연결되었습니다.")
        print(f"연결된 데이터베이스: {settings.MONGODB_DB_NAME}")
    except Exception as e:
        print(f"데이터베이스 연결 실패: {str(e)}")
        print(f"시도한 연결 URL: {settings.DATABASE_URL}")
        raise