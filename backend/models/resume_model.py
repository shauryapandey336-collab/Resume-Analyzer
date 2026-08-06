from datetime import datetime


def create_resume(user_id, filename, filepath):
    return {
        "user_id": user_id,
        "filename": filename,
        "filepath": filepath,
        "uploaded_at": datetime.utcnow()
    }


def resume_response(resume):
    return {
        "id": str(resume["_id"]),
        "user_id": str(resume["user_id"]),
        "filename": resume["filename"],
        "filepath": resume["filepath"],
        "uploaded_at": resume["uploaded_at"]
    }