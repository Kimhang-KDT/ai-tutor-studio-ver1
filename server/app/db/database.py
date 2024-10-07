from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from datetime import datetime
from bson import ObjectId
import json

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

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

async def get_collection(collection_name: str):
    return db[collection_name]

async def get_dataSets():
    collection = await get_collection("dataSets")
    cursor = collection.find({})
    datasets = await cursor.to_list(length=100)
    return json.loads(json.dumps(datasets, cls=JSONEncoder))

async def get_dataset(dataset_id: str):
    collection = await get_collection("dataSets")
    dataset = await collection.find_one({"_id": ObjectId(dataset_id)})
    return json.loads(json.dumps(dataset, cls=JSONEncoder))

async def save_dataset(dataset: dict):
    dataset['created_at'] = datetime.utcnow()
    collection = await get_collection("dataSets")
    result = await collection.insert_one(dataset)
    return str(result.inserted_id)

async def update_dataset(dataset_id: str, dataset: dict):
    collection = await get_collection("dataSets")
    result = await collection.update_one({"_id": ObjectId(dataset_id)}, {"$set": dataset})
    return result.modified_count > 0

