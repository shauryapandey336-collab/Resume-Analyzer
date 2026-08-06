import re


def generate_ai_suggestions(
    resume_text,
    parsed_data,
    skills,
    ats_score,
    resume_score
):

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