
from bson import ObjectId
from datetime import datetime


def create_user(name, email, password):
    return {
        "name": name,
        "email": email.lower(),
        "password": password,
        "phone": "",
        "github": "",
        "linkedin": "",
        "created_at": datetime.utcnow()
    }


def user_response(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "phone": user.get("phone", ""),
        "github": user.get("github", ""),
        "linkedin": user.get("linkedin", "")
    }