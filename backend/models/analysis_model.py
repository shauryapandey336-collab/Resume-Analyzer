from datetime import datetime, timezone


def create_analysis(
    user_id,
    resume_id,
    resume_text,
    parsed_data,
    skills,
    ats_score,
    resume_score,
    ai_suggestion,
    job_match
):

    return {

        "user_id": user_id,

        "resume_id": resume_id,

        "resume_text": resume_text,

        "parsed_data": parsed_data,

        "skills": skills,

        "ats_score": ats_score,

        "resume_score": resume_score,

        "ai_suggestion": ai_suggestion,

        "job_match": job_match,

        "created_at": datetime.now(timezone.utc),

        "updated_at": datetime.now(timezone.utc)

    }


def analysis_response(data):

    return {

        "id": str(data["_id"]),

        "user_id": str(data["user_id"]),

        "resume_id": str(data["resume_id"]),

        "resume_text": data.get("resume_text", ""),

        "parsed_data": data.get("parsed_data", {}),

        "skills": data.get("skills", {}),

        "ats_score": data.get("ats_score", {}),

        "resume_score": data.get("resume_score", 0),

        "ai_suggestion": data.get("ai_suggestion", {}),

        "job_match": data.get("job_match", 0),

        "created_at": data.get("created_at"),

        "updated_at": data.get("updated_at")

    }