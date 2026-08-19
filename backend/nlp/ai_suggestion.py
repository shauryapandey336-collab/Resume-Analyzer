from nlp.ollama_client import query_ollama, is_ollama_available

def generate_ai_suggestions(
    resume_text,
    parsed_data,
    skills,
    ats_score,
    resume_score
):

    # Try utilizing Ollama first if available
    try:
        if is_ollama_available():
            prompt = f"""
As an expert ATS resume reviewer, analyze the following candidate resume information and generate personalized, student-friendly recommendations.
You are given the resume text, extracted sections, scores, and technical details.
Identify:
1. Strengths: key positive aspects of the resume.
2. Weaknesses: specific gaps or areas of improvement in formatting, text, or skills.
3. Suggestions: actionable steps the student can take to improve their resume and get a higher ATS score.

Format the output as a single JSON object. Ensure all fields are present:
- strengths: (list of strings)
- weaknesses: (list of strings)
- suggestions: (list of strings)

Resume Details:
- Name: {parsed_data.get('name', 'Not found')}
- Email: {parsed_data.get('email', 'Not found')}
- Phone: {parsed_data.get('phone', 'Not found')}
- GitHub: {parsed_data.get('github', 'Not found')}
- LinkedIn: {parsed_data.get('linkedin', 'Not found')}
- Technical Skills: {skills.get('technicalSkills', [])}
- Soft Skills: {skills.get('softSkills', [])}
- Education details: {parsed_data.get('education', [])}
- Experience details: {parsed_data.get('experience', [])}
- Projects details: {parsed_data.get('projects', [])}
- Current ATS compatibility estimation: {ats_score}/100
- Resume completeness score: {resume_score}/100

Resume Text:
{resume_text[:2500]}
"""
            llm_suggestions = query_ollama(prompt)
            if llm_suggestions and isinstance(llm_suggestions, dict):
                return {
                    "strengths": [str(s).strip() for s in llm_suggestions.get("strengths", [])],
                    "weaknesses": [str(w).strip() for w in llm_suggestions.get("weaknesses", [])],
                    "suggestions": [str(s).strip() for s in llm_suggestions.get("suggestions", [])]
                }
    except Exception as e:
        print(f"[Ollama Suggestion Generator] Error generating suggestions via LLM: {e}")

    # Fallback to rule-based suggestions
    print("[Ollama Suggestion Generator] Falling back to rule-based suggestions.")

    strengths = []
    weaknesses = []
    suggestions = []

    text = resume_text.lower()

    # ----------------------------
    # Skills
    # ----------------------------

    technical = skills.get("technicalSkills", [])
    soft = skills.get("softSkills", [])

    if len(technical) >= 5:
        strengths.append("Strong technical skill set detected.")
    else:
        weaknesses.append("Technical skills are limited.")
        suggestions.append("Add more relevant technical skills.")

    if len(soft) >= 3:
        strengths.append("Good soft skills mentioned.")
    else:
        suggestions.append(
            "Include communication, teamwork and leadership skills."
        )

    # ----------------------------
    # Summary
    # ----------------------------

    if "summary" not in text and "objective" not in text:
        weaknesses.append("Professional summary not found.")
        suggestions.append(
            "Add a professional summary at the beginning of your resume."
        )
    else:
        strengths.append("Professional summary found.")

    # ----------------------------
    # GitHub
    # ----------------------------

    github = parsed_data.get("github", "")

    if github or "github.com" in text:
        strengths.append("GitHub profile detected.")
    else:
        weaknesses.append("GitHub profile missing.")
        suggestions.append("Add your GitHub profile.")

    # ----------------------------
    # LinkedIn
    # ----------------------------

    linkedin = parsed_data.get("linkedin", "")

    if linkedin or "linkedin.com" in text:
        strengths.append("LinkedIn profile detected.")
    else:
        weaknesses.append("LinkedIn profile missing.")
        suggestions.append("Add your LinkedIn profile.")

    # ----------------------------
    # Projects
    # ----------------------------

    projects = parsed_data.get("projects", [])

    if len(projects) > 0:
        strengths.append(f"{len(projects)} project(s) detected.")
    else:
        weaknesses.append("Projects section missing.")
        suggestions.append(
            "Add at least 2 academic or personal projects."
        )

    # ----------------------------
    # Experience
    # ----------------------------

    experience = parsed_data.get("experience", [])

    if len(experience) > 0:
        strengths.append("Experience section detected.")
    else:
        weaknesses.append("Experience section missing.")
        suggestions.append(
            "Include internships or work experience if available."
        )

    # ----------------------------
    # Education
    # ----------------------------

    education = parsed_data.get("education", [])

    if len(education) > 0:
        strengths.append("Education section available.")
    else:
        weaknesses.append("Education details missing.")
        suggestions.append(
            "Add your educational qualifications."
        )

    # ----------------------------
    # ATS Score
    # ----------------------------

    if ats_score < 80:
        suggestions.append(
            "Improve ATS compatibility by adding relevant keywords."
        )

    # ----------------------------
    # Resume Score
    # ----------------------------

    if resume_score < 75:
        suggestions.append(
            "Improve resume formatting and content quality."
        )

    # Remove duplicates

    strengths = list(dict.fromkeys(strengths))
    weaknesses = list(dict.fromkeys(weaknesses))
    suggestions = list(dict.fromkeys(suggestions))

    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions
    }