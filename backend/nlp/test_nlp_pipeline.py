import sys
import os

# Add backend directory to sys.path
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

if BACKEND_DIR not in sys.path:
    sys.path.append(BACKEND_DIR)


# ============================================================
# NLP MODULE IMPORTS
# ============================================================

from nlp.llm_client import is_llm_available, query_llm
from nlp.resume_parser import parse_resume
from nlp.skill_detector import detect_skills
from nlp.ai_suggestion import generate_ai_suggestions
from nlp.job_matching import match_job


# ============================================================
# SAMPLE RESUME
# ============================================================

SAMPLE_RESUME_TEXT = """
Rishabh Sharma

Email: rishabh.sharma@example.com
Phone: +91-9876543210

GitHub: https://github.com/rishabhsharma
LinkedIn: https://linkedin.com/in/rishabhsharma

Education:

B.Tech in Computer Science and Engineering
ABC Institute of Technology, Graduating 2026

Experience:

Web Development Intern at Tech Solutions
May 2025 - July 2025

- Built web applications using React and Node.js.
- Collaborated with team members using Git and GitHub.

Projects:

AI Resume Analyzer

- Developed a web application using Flask, React, and MongoDB.
- Implemented resume parsing and skill matching using PyMuPDF and TF-IDF.

Skills:

Python, JavaScript, React, Node.js, Express, SQL, MongoDB,
Git, Communication, Problem Solving
"""


# ============================================================
# SAMPLE JOB DESCRIPTION
# ============================================================

SAMPLE_JOB_DESCRIPTION = """
We are looking for a Software Engineer Intern.

Requirements:

- Strong knowledge of Python and SQL.
- Experience with web frameworks like Flask or React.
- Understanding of Git, GitHub, Docker, and AWS is a plus.
- Good communication and team collaboration skills.
"""


# ============================================================
# TEST 1: GROQ CONNECTION
# ============================================================

def test_groq_connection():

    print("\n--- Testing Groq LLM Connection ---")

    available = is_llm_available()

    print(f"Groq API Available: {available}")

    if not available:
        print("[WARNING] GROQ_API_KEY is not configured.")
        return False

    try:
        result = query_llm(
            """
            Return a JSON object with exactly one key:

            {
                "message": "Hello from Groq"
            }
            """
        )

        if result and isinstance(result, dict):

            print("Groq Response:")
            print(result)

            return True

        print("[ERROR] Groq returned an empty or invalid response.")
        return False

    except Exception as e:

        print(f"[ERROR] Groq connection failed: {e}")
        return False


# ============================================================
# TEST 2: RESUME PARSER
# ============================================================

def test_resume_parser():

    print("\n--- Testing Resume Parser ---")

    parsed_data = parse_resume(SAMPLE_RESUME_TEXT)

    print("Parsed Resume:")

    print(f"Name       : {parsed_data.get('name')}")
    print(f"Email      : {parsed_data.get('email')}")
    print(f"Phone      : {parsed_data.get('phone')}")
    print(f"GitHub     : {parsed_data.get('github')}")
    print(f"LinkedIn   : {parsed_data.get('linkedin')}")
    print(f"Education  : {parsed_data.get('education')}")
    print(f"Experience : {parsed_data.get('experience')}")
    print(f"Projects   : {parsed_data.get('projects')}")

    return parsed_data


# ============================================================
# TEST 3: SKILL DETECTION
# ============================================================

def test_skill_detection():

    print("\n--- Testing Skill Detection ---")

    skills = detect_skills(SAMPLE_RESUME_TEXT)

    technical_skills = skills.get("technicalSkills", [])
    soft_skills = skills.get("softSkills", [])

    print("Technical Skills:")
    print(technical_skills)

    print("\nSoft Skills:")
    print(soft_skills)

    return skills


# ============================================================
# TEST 4: AI SUGGESTIONS
# ============================================================

def test_ai_suggestions(parsed_data, skills):

    print("\n--- Testing AI Suggestions ---")

    ats_score = 75
    resume_score = 80

    suggestions = generate_ai_suggestions(
        resume_text=SAMPLE_RESUME_TEXT,
        parsed_data=parsed_data,
        skills=skills,
        ats_score=ats_score,
        resume_score=resume_score
    )

    print("\nStrengths:")
    for item in suggestions.get("strengths", []):
        print(f"  - {item}")

    print("\nWeaknesses:")
    for item in suggestions.get("weaknesses", []):
        print(f"  - {item}")

    print("\nSuggestions:")
    for item in suggestions.get("suggestions", []):
        print(f"  - {item}")

    print("\nPriority Actions:")
    for item in suggestions.get("priorityActions", []):
        print(f"  - {item}")

    print("\nContextual Insights:")
    for item in suggestions.get("contextualInsights", []):
        print(f"  - {item}")

    print("\nOverall Assessment:")
    print(suggestions.get("overallAssessment", ""))

    return suggestions


# ============================================================
# TEST 5: JOB MATCHING
# ============================================================

def test_job_matching():

    print("\n--- Testing Job Matching ---")

    match_result = match_job(
        SAMPLE_RESUME_TEXT,
        SAMPLE_JOB_DESCRIPTION
    )

    print(f"\nMatch Score: {match_result.get('score')}%")

    print("\nMatched Skills:")
    for skill in match_result.get("matchedSkills", []):
        print(f"  - {skill}")

    print("\nMissing Skills:")
    for skill in match_result.get("missingSkills", []):
        print(f"  - {skill}")

    print("\nRecommendations:")
    for recommendation in match_result.get("recommendations", []):
        print(f"  - {recommendation}")

    print("\nContextual Insights:")
    for insight in match_result.get("contextualInsights", []):
        print(f"  - {insight}")

    print("\nPriority Actions:")
    for action in match_result.get("priorityActions", []):
        print(f"  - {action}")

    print("\nOverall Assessment:")
    print(match_result.get("overallAssessment", ""))

    return match_result


# ============================================================
# MAIN TEST PIPELINE
# ============================================================

def run_tests():

    print("=" * 70)
    print("       AI RESUME ANALYZER - NLP PIPELINE TESTS")
    print("=" * 70)

    # --------------------------------------------------------
    # 1. Groq Connection
    # --------------------------------------------------------

    groq_available = test_groq_connection()

    if not groq_available:

        print("\n[WARNING]")
        print("Groq is not available.")
        print("Check GROQ_API_KEY inside backend/.env")
        print("Continuing with fallback NLP mechanisms...\n")

    # --------------------------------------------------------
    # 2. Resume Parser
    # --------------------------------------------------------

    parsed_data = test_resume_parser()

    # --------------------------------------------------------
    # 3. Skill Detection
    # --------------------------------------------------------

    skills = test_skill_detection()

    # --------------------------------------------------------
    # 4. AI Suggestions
    # --------------------------------------------------------

    suggestions = test_ai_suggestions(
        parsed_data,
        skills
    )

    # --------------------------------------------------------
    # 5. Job Matching
    # --------------------------------------------------------

    match_result = test_job_matching()

    # --------------------------------------------------------
    # Final Summary
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("                    TEST SUMMARY")
    print("=" * 70)

    print(f"Groq Available       : {groq_available}")
    print(f"Resume Parser        : {'OK' if parsed_data else 'FAILED'}")
    print(f"Skill Detection      : {'OK' if skills else 'FAILED'}")
    print(f"AI Suggestions       : {'OK' if suggestions else 'FAILED'}")
    print(f"Job Matching         : {'OK' if match_result else 'FAILED'}")

    print("=" * 70)
    print("             NLP PIPELINE TEST COMPLETED")
    print("=" * 70)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    run_tests()