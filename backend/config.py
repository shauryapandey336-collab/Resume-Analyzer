import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    MONGO_URI = os.getenv("MONGO_URI")

    DATABASE_NAME = os.getenv("DATABASE_NAME")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER")

    MAX_CONTENT_LENGTH = int(
        os.getenv("MAX_CONTENT_LENGTH")
    )