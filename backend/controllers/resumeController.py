from datetime import datetime, timezone

from flask import request, jsonify
from bson import ObjectId

from db.connectDb import resumes, analysis

from middleware.upload import save_resume

from models.resume_model import create_resume
from models.analysis_model import create_analysis

from nlp.extract_text import extract_text
from nlp.preprocessing import preprocess_text
from nlp.resume_parser import parse_resume
from nlp.skill_detector import detect_skills
from nlp.ats_score import calculate_ats_score
from nlp.ai_suggestion import generate_ai_suggestions
from nlp.job_matching import match_job


# =====================================================
# Helpers
# =====================================================

def _success(message, data=None, status=200):

    return jsonify({

        "success": True,
        "message": message,
        "data": data

    }), status


def _error(message, status=400):

    return jsonify({

        "success": False,
        "message": message

    }), status


def _get_resume(resume_id, user_id):

    return resumes.find_one({

        "_id": ObjectId(resume_id),
        "user_id": ObjectId(user_id)

    })


def _get_analysis(resume_id, user_id):

    return analysis.find_one({

        "resume_id": ObjectId(resume_id),
        "user_id": ObjectId(user_id)

    })


# =====================================================
# Resume Score
# =====================================================

def _calculate_resume_score(parsed_data, skills, ats_score):

    ats = ats_score.get("score", 0)

    technical = skills.get("technicalSkills", [])

    skill_score = min(len(technical) * 2, 20)

    completeness = 0

    if parsed_data.get("name"):
        completeness += 10

    if parsed_data.get("email"):
        completeness += 10

    if parsed_data.get("phone"):
        completeness += 10

    if parsed_data.get("education"):
        completeness += 10

    if parsed_data.get("experience"):
        completeness += 10

    if parsed_data.get("projects"):
        completeness += 10

    score = ats + skill_score + completeness

    return min(score, 100)


# =====================================================
# Upload Resume
# =====================================================

def upload_resume(current_user):

    try:

        if "resume" not in request.files:

            return _error(
                "Resume file is required.",
                400
            )

        file = request.files["resume"]

        user_id = current_user["_id"]

        # Save File

        filename, filepath = save_resume(file)

        # Save Resume

        resume_doc = create_resume(

            user_id=user_id,

            filename=filename,

            filepath=filepath

        )

        result = resumes.insert_one(
            resume_doc
        )

        resume_id = result.inserted_id

        # NLP Pipeline

        resume_text = extract_text(filepath)

        cleaned_text = preprocess_text(
            resume_text
        )

        parsed_data = parse_resume(
            cleaned_text
        )

        skills = detect_skills(
            cleaned_text
        )

        ats_score = calculate_ats_score(

            parsed_data,

            skills

        )

        resume_score = _calculate_resume_score(

            parsed_data,

            skills,

            ats_score

        )

        ai_suggestion = generate_ai_suggestions(

            resume_text=cleaned_text,

            parsed_data=parsed_data,

            skills=skills,

            ats_score=ats_score.get("score", 0),

            resume_score=resume_score

        )

        analysis_doc = create_analysis(

            resume_id=resume_id,

            user_id=user_id,

            resume_text=resume_text,

            parsed_data=parsed_data,

            skills=skills,

            ats_score=ats_score,

            resume_score=resume_score,

            ai_suggestion=ai_suggestion,

            job_match=0

        )

        analysis.insert_one(
            analysis_doc
        )

        return _success(

            "Resume uploaded successfully.",

            {

                "resumeId": str(resume_id),

                "filename": filename,

                "parsedData": parsed_data,

                "skills": skills,

                "atsScore": ats_score,

                "resumeScore": resume_score,

                "aiSuggestion": ai_suggestion

            },

            201

        )

    except Exception as e:

        print(e)

        return _error(

            str(e),

            500

        )
    # =====================================================
# Resume Parser
# =====================================================

def resume_parser(current_user, resume_id):

    try:

        record = _get_analysis(

            resume_id,

            current_user["_id"]

        )

        if not record:

            return _error(

                "Resume analysis not found.",

                404

            )

        return _success(

            "Resume parsed successfully.",

            {

                "resumeId": resume_id,

                "parsedData": record.get(

                    "parsed_data",

                    {}

                )

            }

        )

    except Exception as e:

        return _error(

            str(e),

            500

        )


# =====================================================
# Skill Detection
# =====================================================

def skill_detection(current_user, resume_id):

    try:

        record = _get_analysis(

            resume_id,

            current_user["_id"]

        )

        if not record:

            return _error(

                "Resume analysis not found.",

                404

            )

        return _success(

            "Skills fetched successfully.",

            {

                "resumeId": resume_id,

                "skills": record.get(

                    "skills",

                    {}

                )

            }

        )

    except Exception as e:

        return _error(

            str(e),

            500

        )


# =====================================================
# ATS Score
# =====================================================

def ats_score(current_user, resume_id):

    try:

        record = _get_analysis(

            resume_id,

            current_user["_id"]

        )

        if not record:

            return _error(

                "Resume analysis not found.",

                404

            )

        return _success(

            "ATS Score fetched successfully.",

            {

                "resumeId": resume_id,

                "atsScore": record.get(

                    "ats_score",

                    {}

                )

            }

        )

    except Exception as e:

        return _error(

            str(e),

            500

        )
    # =====================================================
# Resume Score
# =====================================================

def resume_score(current_user, resume_id):

    try:

        record = _get_analysis(

            resume_id,

            current_user["_id"]

        )

        if not record:

            return _error(

                "Resume analysis not found.",

                404

            )

        return _success(

            "Resume Score fetched successfully.",

            {

                "resumeId": resume_id,

                "resumeScore": record.get(

                    "resume_score",

                    0

                )

            }

        )

    except Exception as e:

        return _error(

            str(e),

            500


        )


# =====================================================
# AI Suggestion
# =====================================================

def ai_suggestion(current_user, resume_id):

    try:

        record = _get_analysis(

            resume_id,

            current_user["_id"]

        )

        if not record:

            return _error(

                "Resume analysis not found.",

                404

            )

        return _success(

            "AI Suggestions fetched successfully.",

            {

                "resumeId": resume_id,

                "aiSuggestion": record.get(

                    "ai_suggestion",

                    {}

                )

            }

        )

    except Exception as e:

        return _error(

            str(e),

            500

        )


# =====================================================
# Job Matching
# =====================================================

def job_matching(current_user):

    try:

        body = request.get_json()

        if body is None:

            return _error(

                "Request body is required.",

                400

            )

        resume_id = body.get(

            "resumeId"

        )

        job_description = body.get(

            "jobDescription"

        )

        if not resume_id:

            return _error(

                "resumeId is required.",

                400

            )

        if not job_description:

            return _error(

                "jobDescription is required.",

                400

            )

        record = _get_analysis(

            resume_id,

            current_user["_id"]

        )

        if not record:

            return _error(

                "Resume analysis not found.",

                404

            )

        resume_text = record.get(

            "resume_text",

            ""

        )

        result = match_job(

            resume_text,

            job_description

        )

        analysis.update_one(

            {

                "_id": record["_id"]

            },

            {

                "$set": {

                    "job_match": result,

                    "updated_at": datetime.now(

                        timezone.utc

                    )

                }

            }

        )

        return _success(

            "Job Matching completed successfully.",

            {

                "resumeId": resume_id,

                "jobMatch": result

            }

        )

    except Exception as e:

        return _error(

            str(e),

            500

        )