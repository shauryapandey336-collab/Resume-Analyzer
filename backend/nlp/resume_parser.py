import re
from nlp.ollama_client import query_ollama, is_ollama_available


def parse_resume(text):

    # Try using Ollama first if available
    try:
        if is_ollama_available():
            system_prompt = "You are a professional Resume Parser. Extract details from the resume text exactly matching the requested JSON format."
            prompt = f"""
Analyze the following resume text and extract the candidate's details into the specified JSON structure.
Format the output as a single JSON object. Ensure all fields are present:
- name: (string) The candidate's full name. If not found, leave as empty string.
- email: (string) The candidate's email address. If not found, leave as empty string.
- phone: (string) The candidate's phone number. If not found, leave as empty string.
- github: (string) The URL of the candidate's GitHub profile. If not found, leave as empty string.
- linkedin: (string) The URL of the candidate's LinkedIn profile. If not found, leave as empty string.
- education: (list of strings) Key lines or summaries describing degrees, institutes, graduation dates, or grades.
- experience: (list of strings) Key lines or descriptions of professional work, roles, responsibilities, or internships.
- projects: (list of strings) Key lines or details of personal, academic, or professional projects.

Resume text:
{text}
"""
            llm_data = query_ollama(prompt, system_prompt=system_prompt)
            if llm_data and isinstance(llm_data, dict):
                # Ensure all keys exist
                parsed = {
                    "name": str(llm_data.get("name", "")).strip(),
                    "email": str(llm_data.get("email", "")).strip(),
                    "phone": str(llm_data.get("phone", "")).strip(),
                    "github": str(llm_data.get("github", "")).strip(),
                    "linkedin": str(llm_data.get("linkedin", "")).strip(),
                    "education": list(llm_data.get("education", [])),
                    "experience": list(llm_data.get("experience", [])),
                    "projects": list(llm_data.get("projects", []))
                }
                # Double check that list values are strings
                parsed["education"] = [str(x) for x in parsed["education"]]
                parsed["experience"] = [str(x) for x in parsed["experience"]]
                parsed["projects"] = [str(x) for x in parsed["projects"]]

                # Regex validation post-processing (just in case LLM missed contact info)
                if not parsed["email"]:
                    email_match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
                    if email_match:
                        parsed["email"] = email_match.group()
                if not parsed["phone"]:
                    phone_match = re.search(r"(\+91[- ]?)?[6-9]\d{9}", text)
                    if phone_match:
                        parsed["phone"] = phone_match.group()
                if not parsed["github"]:
                    github_match = re.search(r"https?://github\.com/\S+", text)
                    if github_match:
                        parsed["github"] = github_match.group()
                if not parsed["linkedin"]:
                    linkedin_match = re.search(r"https?://(www\.)?linkedin\.com/\S+", text)
                    if linkedin_match:
                        parsed["linkedin"] = linkedin_match.group()

                return parsed
    except Exception as e:
        print(f"[Ollama Parser] Failed to parse with LLM, falling back: {e}")

    # Fallback to rule-based parser if LLM fails or is unavailable
    print("[Ollama Parser] Falling back to regex-based parser.")

    data = {

        "name": "",

        "email": "",

        "phone": "",

        "github": "",

        "linkedin": "",

        "education": [],

        "experience": [],

        "projects": []

    }

    # --------------------------------
    # Email
    # --------------------------------

    email = re.search(

        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",

        text

    )

    if email:

        data["email"] = email.group()

    # --------------------------------
    # Phone
    # --------------------------------

    phone = re.search(

        r"(\+91[- ]?)?[6-9]\d{9}",

        text

    )

    if phone:

        data["phone"] = phone.group()

    # --------------------------------
    # GitHub
    # --------------------------------

    github = re.search(

        r"https?://github\.com/\S+",

        text

    )

    if github:

        data["github"] = github.group()

    # --------------------------------
    # LinkedIn
    # --------------------------------

    linkedin = re.search(

        r"https?://(www\.)?linkedin\.com/\S+",

        text

    )

    if linkedin:

        data["linkedin"] = linkedin.group()

    # --------------------------------
    # Name
    # --------------------------------

    lines = text.split("\n")

    for line in lines:

        line = line.strip()

        if len(line.split()) >= 2:

            if not any(

                word.lower() in line.lower()

                for word in [

                    "resume",

                    "email",

                    "phone",

                    "github",

                    "linkedin"

                ]

            ):

                data["name"] = line

                break

    # --------------------------------
    # Education
    # --------------------------------

    education_keywords = [

        "b.tech",

        "bachelor",

        "master",

        "m.tech",

        "bca",

        "mca",

        "university",

        "college",

        "school"

    ]

    for line in lines:

        for keyword in education_keywords:

            if keyword.lower() in line.lower():

                data["education"].append(line)

                break

    # --------------------------------
    # Experience
    # --------------------------------

    experience_keywords = [

        "intern",

        "experience",

        "developer",

        "engineer",

        "worked",

        "company"

    ]

    for line in lines:

        for keyword in experience_keywords:

            if keyword.lower() in line.lower():

                data["experience"].append(line)

                break

    # --------------------------------
    # Projects
    # --------------------------------

    project_keywords = [

        "project",

        "developed",

        "built",

        "application",

        "system",

        "website"

    ]

    for line in lines:

        for keyword in project_keywords:

            if keyword.lower() in line.lower():

                data["projects"].append(line)

                break

    # Remove duplicates

    data["education"] = list(

        set(data["education"])

    )

    data["experience"] = list(

        set(data["experience"])

    )

    data["projects"] = list(

        set(data["projects"])

    )

    return data