from flask import jsonify
from bson import ObjectId

from db.connectDb import analysis, resumes


def dashboard(current_user):

    try:

        user_id = current_user["_id"]

        latest_analysis = analysis.find_one(
            {
                "user_id": user_id
            },
            sort=[("created_at", -1)]
        )

        if latest_analysis is None:

            return jsonify({

                "success": True,

                "dashboard": {

                    "resumeId": "",

                    "resumeScore": 0,

                    "atsScore": 0,

                    "skills": 0,

                    "jobMatch": 0,

                    "recentResume": "",

                    "lastUpdated": ""

                }

            }), 200

        # Get filename from resumes collection
        resume_doc = resumes.find_one({
            "_id": latest_analysis.get("resume_id")
        })

        filename = resume_doc["filename"] if resume_doc else ""

        # Extract ATS score value
        ats_data = latest_analysis.get("ats_score", {})
        ats_value = ats_data.get("score", 0) if isinstance(ats_data, dict) else ats_data

        # Extract skills count
        skills_data = latest_analysis.get("skills", {})
        technical_skills = skills_data.get("technicalSkills", []) if isinstance(skills_data, dict) else []
        soft_skills = skills_data.get("softSkills", []) if isinstance(skills_data, dict) else []
        total_skills = len(technical_skills) + len(soft_skills)

        # Extract job match score
        job_data = latest_analysis.get("job_match", 0)
        job_value = job_data.get("score", 0) if isinstance(job_data, dict) else job_data

        dashboard_data = {

            "resumeId": str(latest_analysis.get("resume_id", "")),

            "resumeScore": latest_analysis.get(
                "resume_score",
                0
            ),

            "atsScore": ats_value,

            "skills": total_skills,

            "jobMatch": job_value,

            "recentResume": filename,

            "lastUpdated": str(
                latest_analysis.get(
                    "created_at",
                    ""
                )
            )

        }

        return jsonify({

            "success": True,

            "dashboard": dashboard_data

        }), 200

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


def get_all_resumes(current_user):

    try:

        user_id = current_user["_id"]

        # Get all resumes for this user
        user_resumes = list(resumes.find(
            {"user_id": user_id}
        ).sort("uploaded_at", -1))

        results = []

        for resume in user_resumes:

            resume_id = resume["_id"]

            # Get analysis for this resume
            analysis_doc = analysis.find_one({
                "resume_id": resume_id,
                "user_id": user_id
            })

            ats_data = {}
            resume_score = 0
            job_data = 0
            ai_suggestion = {}
            parsed_data = {}
            skills_data = {}

            if analysis_doc:
                ats_data = analysis_doc.get("ats_score", {})
                resume_score = analysis_doc.get("resume_score", 0)
                job_data = analysis_doc.get("job_match", 0)
                ai_suggestion = analysis_doc.get("ai_suggestion", {})
                parsed_data = analysis_doc.get("parsed_data", {})
                skills_data = analysis_doc.get("skills", {})

            ats_value = ats_data.get("score", 0) if isinstance(ats_data, dict) else ats_data
            job_value = job_data.get("score", 0) if isinstance(job_data, dict) else job_data

            results.append({
                "resumeId": str(resume_id),
                "filename": resume.get("filename", ""),
                "uploadedAt": str(resume.get("uploaded_at", "")),
                "atsScore": ats_value,
                "resumeScore": resume_score,
                "jobMatch": job_value,
                "aiSuggestion": ai_suggestion,
                "parsedData": parsed_data,
                "skills": skills_data
            })

        return jsonify({

            "success": True,

            "resumes": results

        }), 200

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500