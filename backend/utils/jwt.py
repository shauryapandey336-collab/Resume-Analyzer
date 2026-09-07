import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv


# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()


JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

JWT_ALGORITHM = "HS256"

JWT_EXPIRATION_HOURS = 24


# ==========================================
# Validate Configuration
# ==========================================

if not JWT_SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY is not configured in .env"
    )

if len(JWT_SECRET_KEY.encode("utf-8")) < 32:
    raise RuntimeError(
        "JWT_SECRET_KEY must be at least 32 bytes long."
    )


# ==========================================
# Generate JWT Token
# ==========================================

def generate_token(user_id):

    payload = {
        "sub": str(user_id),
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc)
        + timedelta(hours=JWT_EXPIRATION_HOURS),
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    return token


# ==========================================
# Decode JWT Token
# ==========================================

def decode_token(token):

    payload = jwt.decode(
        token,
        JWT_SECRET_KEY,
        algorithms=[JWT_ALGORITHM]
    )

    return payload