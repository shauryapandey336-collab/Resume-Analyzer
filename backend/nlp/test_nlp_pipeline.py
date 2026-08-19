import sys
import os

# Add parent directory to sys.path so we can import modules correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from nlp.ollama_client import is_ollama_available, query_ollama
from nlp.resume_parser import parse_resume
from nlp.skill_detector import detect_skills
from nlp.ai_suggestion import generate_ai_suggestions
from nlp.job_matching import match_job

# Test Sample Data
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
Web Development Intern at Tech Solutions (May 2025 - July 2025)
- Built web applications using React and Node.js
- Collaborated with team members using Git and GitHub

Projects:
AI Resume Analyzer
- Developed a web application using Flask, React, and MongoDB
- Implemented resume parsing and skill matching algorithm using PyMuPDF and TF-IDF

Skills:
Python, JavaScript, React, Node.js, Express, SQL, MongoDB, Git, Communication, Problem Solving
"""

SAMPLE_JOB_DESCRIPTION = """
We are looking for a Software Engineer Intern.
Requirements:
- Strong knowledge of Python and SQL.
- Experience with web frameworks like Flask or React.
- Understanding of Git, GitHub, Docker, and AWS is a plus.
- Good communication and team collaboration skills.
"""

def run_tests():
    print("=" * 60)
    print("RUNNING NLP PIPELINE TESTS")
    print("=" * 60)

    # 1. Test Ollama availability
    available = is_ollama_available()
    print(f"Ollama Available: {available}")
    if not available:
        print("[Warning] Ollama local service or 'llama3' model is not running.")
        print("Tests will run using rule-based/regex fallback mechanisms.")

    # 2. Test Parser
    print("\n--- Testing Resume Parser ---")
    parsed_data = parse_resume(SAMPLE_RESUME_TEXT)
    print("Parsed Result:")
    print(f"  Name: {parsed_data.get('name')}")
    print(f"  Email: {parsed_data.get('email')}")
    print(f"  Phone: {parsed_data.get('phone')}")
    print(f"  GitHub: {parsed_data.get('github')}")
    print(f"  LinkedIn: {parsed_data.get('linkedin')}")
    print(f"  Education: {parsed_data.get('education')}")
    print(f"  Experience: {parsed_data.get('experience')}")
    print(f"  Projects: {parsed_data.get('projects')}")

    # 3. Test Skill Detection
    print("\n--- Testing Skill Detection ---")
    skills = detect_skills(SAMPLE_RESUME_TEXT)
    print(f"Detected Technical Skills: {skills.get('technicalSkills')}")
    print(f"Detected Soft Skills: {skills.get('softSkills')}")

    # 4. Test Suggestions
    print("\n--- Testing Suggestions ---")
    ats_score = 75
    resume_score = 80
    suggestions = generate_ai_suggestions(
        resume_text=SAMPLE_RESUME_TEXT,
        parsed_data=parsed_data,
        skills=skills,
        ats_score=ats_score,
        resume_score=resume_score
    )
    print("Strengths:", suggestions.get("strengths"))
    print("Weaknesses:", suggestions.get("weaknesses"))
    print("Suggestions:", suggestions.get("suggestions"))

    # 5. Test Job Matching
    print("\n--- Testing Job Matching ---")
    match_result = match_job(SAMPLE_RESUME_TEXT, SAMPLE_JOB_DESCRIPTION)
    print(f"Match Score: {match_result.get('score')}%")
    print("Matched Skills:", match_result.get("matchedSkills"))
    print("Missing Skills:", match_result.get("missingSkills"))
    print("Recommendations:", match_result.get("recommendations"))

    print("\n" + "=" * 60)
    print("ALL TESTS COMPLETED SUCCESSFULLY")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
