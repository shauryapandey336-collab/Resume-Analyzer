import re

from nlp.llm_client import query_llm, is_llm_available


def _ensure_list(value):
    """Normalize LLM output into a list."""
    if value is None:
        return []

    if isinstance(value, list):
        return value

    return [value]


def _clean_url(value):
    if not value:
        return ""

    return str(value).strip().rstrip(".,);]")


def _regex_contact_data(text):
    data = {
        "email": "",
        "phone": "",
        "github": "",
        "linkedin": ""
    }

    email_match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    if email_match:
        data["email"] = email_match.group().strip()

    phone_match = re.search(
        r"(?:\+91[- ]?)?[6-9]\d{9}",
        text
    )

    if phone_match:
        data["phone"] = phone_match.group().strip()

    github_match = re.search(
        r"https?://(?:www\.)?github\.com/[^\s)\]]+",
        text,
        re.IGNORECASE
    )

    if github_match:
        data["github"] = _clean_url(github_match.group())

    linkedin_match = re.search(
        r"https?://(?:www\.)?linkedin\.com/[^\s)\]]+",
        text,
        re.IGNORECASE
    )

    if linkedin_match:
        data["linkedin"] = _clean_url(linkedin_match.group())

    return data


def _fallback_parser(text):
    contact = _regex_contact_data(text)

    data = {
        "name": "",
        "email": contact["email"],
        "phone": contact["phone"],
        "github": contact["github"],
        "linkedin": contact["linkedin"],
        "education": [],
        "experience": [],
        "projects": []
    }

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    # Name
    for line in lines[:10]:
        lowered = line.lower()

        if (
            len(line.split()) >= 2
            and "@" not in line
            and "github" not in lowered
            and "linkedin" not in lowered
            and "phone" not in lowered
            and "email" not in lowered
        ):
            data["name"] = line
            break

    education_keywords = [
        "b.tech",
        "btech",
        "bachelor",
        "m.tech",
        "mtech",
        "master",
        "bca",
        "mca",
        "university",
        "college",
        "school",
        "degree"
    ]

    experience_keywords = [
        "intern",
        "internship",
        "developer",
        "engineer",
        "experience",
        "worked",
        "company",
        "software engineer"
    ]

    project_keywords = [
        "project",
        "developed",
        "built",
        "application",
        "system",
        "website"
    ]

    for line in lines:
        lowered = line.lower()

        if any(keyword in lowered for keyword in education_keywords):
            data["education"].append(line)

        if any(keyword in lowered for keyword in experience_keywords):
            data["experience"].append(line)

        if any(keyword in lowered for keyword in project_keywords):
            data["projects"].append(line)

    data["education"] = list(dict.fromkeys(data["education"]))
    data["experience"] = list(dict.fromkeys(data["experience"]))
    data["projects"] = list(dict.fromkeys(data["projects"]))

    return data


def parse_resume(text):

    if not text or not text.strip():
        return {
            "name": "",
            "email": "",
            "phone": "",
            "github": "",
            "linkedin": "",
            "education": [],
            "experience": [],
            "projects": []
        }

    if is_llm_available():

        system_prompt = """
You are a professional resume information extraction engine.

Extract ONLY information explicitly present in the resume.

Never invent experience, skills, companies, dates, projects or qualifications.

Return valid JSON only.
"""

        prompt = f"""
Parse this resume into exactly this JSON structure:

{{
    "name": "",
    "email": "",
    "phone": "",
    "github": "",
    "linkedin": "",
    "education": [],
    "experience": [],
    "projects": []
}}

Rules:

1. name must be a string.
2. email must be a string.
3. phone must be a string.
4. github must be a string.
5. linkedin must be a string.
6. education must be a list of objects.
7. experience must be a list of objects.
8. projects must be a list of objects.
9. Do not convert objects into strings.
10. Do not invent missing information.
11. Preserve important details such as dates, organizations,
   technologies and responsibilities.

For education, use objects such as:

{{
    "degree": "",
    "institution": "",
    "graduation_year": ""
}}

For experience:

{{
    "role": "",
    "organization": "",
    "dates": "",
    "responsibilities": []
}}

For projects:

{{
    "name": "",
    "technologies": [],
    "purpose": "",
    "implementation_details": ""
}}

Resume:

{text}
"""

        try:
            result = query_llm(
                prompt,
                system_prompt=system_prompt
            )

            if isinstance(result, dict):

                parsed = {
                    "name": str(result.get("name", "")).strip(),
                    "email": str(result.get("email", "")).strip(),
                    "phone": str(result.get("phone", "")).strip(),
                    "github": _clean_url(result.get("github", "")),
                    "linkedin": _clean_url(result.get("linkedin", "")),
                    "education": _ensure_list(result.get("education")),
                    "experience": _ensure_list(result.get("experience")),
                    "projects": _ensure_list(result.get("projects"))
                }

                # Validate contact information using deterministic regex.
                regex_data = _regex_contact_data(text)

                if not parsed["email"]:
                    parsed["email"] = regex_data["email"]

                if not parsed["phone"]:
                    parsed["phone"] = regex_data["phone"]

                if not parsed["github"]:
                    parsed["github"] = regex_data["github"]

                if not parsed["linkedin"]:
                    parsed["linkedin"] = regex_data["linkedin"]

                return parsed

        except Exception as e:
            print(f"[Groq Parser] Falling back to deterministic parser: {e}")

    return _fallback_parser(text)