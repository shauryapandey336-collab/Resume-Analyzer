from flask import Blueprint, request

from middleware.auth import token_required


# ==========================================
# Auth Controller
# ==========================================

from controllers.authController import (
    register,
    login,
    get_profile,
    edit_profile
)


# ==========================================
# Resume Controller
# ==========================================

from controllers.resumeController import (
    upload_resume,
    resume_parser,
    skill_detection,
    ats_score,
    resume_score,
    ai_suggestion,
    job_matching
)


# ==========================================
# Dashboard Controller
# ==========================================

from controllers.dashboardController import (
    dashboard,
    get_all_resumes
)


# ==========================================
# Helpers
# ==========================================

def _success(message, data=None):

    response = {
        "success": True,
        "message": message
    }

    if data is not None:
        response["data"] = data

    return response, 200


def _error(message, status_code):

    return {
        "success": False,
        "message": message
    }, status_code


# ==========================================
# Blueprint
# ==========================================

web = Blueprint(
    "web",
    __name__
)


# ===================================================
# Authentication
# ===================================================

@web.route(
    "/auth/register",
    methods=["POST"]
)
def register_route():

    return register()


@web.route(
    "/auth/login",
    methods=["POST"]
)
def login_route():

    return login()


@web.route(
    "/auth/profile",
    methods=["GET"]
)
@token_required
def profile_route(current_user):

    return get_profile(current_user)


@web.route(
    "/auth/profile",
    methods=["PUT"]
)
@token_required
def edit_profile_route(current_user):

    return edit_profile(current_user)


# ===================================================
# Resume
# ===================================================

@web.route(
    "/resume/upload",
    methods=["POST"]
)
@token_required
def upload_resume_route(current_user):

    return upload_resume(current_user)


@web.route(
    "/resume/all",
    methods=["GET"]
)
@token_required
def all_resumes_route(current_user):

    return get_all_resumes(current_user)


@web.route(
    "/resume/parser/<resume_id>",
    methods=["GET"]
)
@token_required
def parser_route(
    current_user,
    resume_id
):

    return resume_parser(
        current_user,
        resume_id
    )


@web.route(
    "/resume/skills/<resume_id>",
    methods=["GET"]
)
@token_required
def skills_route(
    current_user,
    resume_id
):

    return skill_detection(
        current_user,
        resume_id
    )


@web.route(
    "/resume/ats/<resume_id>",
    methods=["GET"]
)
@token_required
def ats_route(
    current_user,
    resume_id
):

    return ats_score(
        current_user,
        resume_id
    )


@web.route(
    "/resume/score/<resume_id>",
    methods=["GET"]
)
@token_required
def score_route(
    current_user,
    resume_id
):

    return resume_score(
        current_user,
        resume_id
    )


@web.route(
    "/resume/ai-suggestion/<resume_id>",
    methods=["GET"]
)
@token_required
def suggestion_route(
    current_user,
    resume_id
):

    return ai_suggestion(
        current_user,
        resume_id
    )


# ===================================================
# Chatbot
# ===================================================

@web.route(
    "/chatbot",
    methods=["POST"]
)
@token_required
def chatbot_route(current_user):

    try:

        # --------------------------------------
        # Get Request Body
        # --------------------------------------

        body = request.get_json()

        if body is None:

            return _error(
                "Request body is required.",
                400
            )

        # --------------------------------------
        # Get Message
        # --------------------------------------

        message = body.get("message")

        if not message:

            return _error(
                "Message is required.",
                400
            )

        # --------------------------------------
        # Import LLM Service
        # --------------------------------------

        from nlp.llm_client import (
            query_llm,
            is_llm_available
        )

        # --------------------------------------
        # Check Groq
        # --------------------------------------

        if not is_llm_available():

            return _error(
                "AI service is not configured. Please set up GROQ_API_KEY.",
                503
            )

        # --------------------------------------
        # System Prompt
        # --------------------------------------

        system_prompt = """
You are a helpful AI assistant for the AI Resume Analyzer platform.

Users can ask you about:
- Resume optimization
- Career advice
- ATS
- Skill development
- Job searching
- Job market insights

Provide helpful, accurate, professional and concise responses.

If the question is outside resume, career, ATS, skills or job searching topics,
politely redirect the user toward career and resume related topics.
"""

        prompt = f"""
User is asking:

{message}

Provide a helpful response related to resumes, careers, ATS, skills,
or job searching.
"""

        # --------------------------------------
        # Query Groq
        # --------------------------------------

        result = query_llm(
            prompt,
            system_prompt=system_prompt
        )

        if result is None:

            return _error(
                "AI service is currently unavailable.",
                503
            )

        # --------------------------------------
        # Success
        # --------------------------------------

        return _success(
            "AI response generated successfully.",
            {
                "response": result
            }
        )

    except Exception as e:

        print(
            f"Chatbot error: {e}"
        )

        return _error(
            "Failed to generate AI response.",
            500
        )


# ===================================================
# Job Matching
# ===================================================

@web.route(
    "/resume/job-match",
    methods=["POST"]
)
@token_required
def job_match_route(current_user):

    return job_matching(
        current_user
    )


# ===================================================
# Dashboard
# ===================================================

@web.route(
    "/dashboard",
    methods=["GET"]
)
@token_required
def dashboard_route(current_user):

    return dashboard(
        current_user
    )