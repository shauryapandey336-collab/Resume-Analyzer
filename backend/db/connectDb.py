from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)

db = client[Config.DATABASE_NAME]

users = db["users"]

resumes = db["resumes"]

analysis = db["analysis"]