import re


def calculate_ats_score(parsed_data, skills):

    score = 0

    passed = []

    failed = []

    # ------------------------
    # Name
    # ------------------------

    if parsed_data.get("name"):
        score += 10
        passed.append("Name Found")
    else:
        failed.append("Name Missing")

    # ------------------------
    # Email
    # ------------------------

    if parsed_data.get("email"):
        score += 10
        passed.append("Email Found")
    else:
        failed.append("Email Missing")

    # ------------------------
    # Phone
    # ------------------------

    if parsed_data.get("phone"):
        score += 10
        passed.append("Phone Number Found")
    else:
        failed.append("Phone Number Missing")

    # ------------------------
    # Skills
    # ------------------------

    technical = skills.get("technicalSkills", [])

    if len(technical) >= 5:
        score += 20
        passed.append("Technical Skills")
    else:
        failed.append("Technical Skills Missing")

    # ------------------------
    # Education
    # ------------------------

    if len(parsed_data.get("education", [])) > 0:
        score += 15
        passed.append("Education Section")
    else:
        failed.append("Education Missing")

    # ------------------------
    # Experience
    # ------------------------

    if len(parsed_data.get("experience", [])) > 0:
        score += 15
        passed.append("Experience Section")
    else:
        failed.append("Experience Missing")

    # ------------------------
    # Projects
    # ------------------------

    if len(parsed_data.get("projects", [])) > 0:
        score += 10
        passed.append("Projects Section")
    else:
        failed.append("Projects Missing")

    # ------------------------
    # GitHub
    # ------------------------

    github = parsed_data.get("github", "")

    if github:
        score += 5
        passed.append("GitHub Profile")
    else:
        failed.append("GitHub Missing")

    # ------------------------
    # LinkedIn
    # ------------------------

    linkedin = parsed_data.get("linkedin", "")

    if linkedin:
        score += 5
        passed.append("LinkedIn Profile")
    else:
        failed.append("LinkedIn Missing")

    return {

        "score": score,

        "passed": passed,

        "failed": failed

    }