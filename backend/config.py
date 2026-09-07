import os

from dotenv import load_dotenv


# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()


class Config:

    # ==========================================
    # MongoDB
    # ==========================================

    MONGO_URI = os.getenv("MONGO_URI")

    DATABASE_NAME = os.getenv("DATABASE_NAME")

    # ==========================================
    # JWT
    # ==========================================

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    # ==========================================
    # Upload Configuration
    # ==========================================

    UPLOAD_FOLDER = os.getenv(
        "UPLOAD_FOLDER",
        "uploads"
    )

    MAX_CONTENT_LENGTH = int(
        os.getenv(
            "MAX_CONTENT_LENGTH",
            "16777216"
        )
    )