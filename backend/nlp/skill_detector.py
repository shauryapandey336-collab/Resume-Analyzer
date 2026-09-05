import re

from nlp.llm_client import query_llm, is_llm_available


# ============================================================
# Technical Skills
# ============================================================

TECHNICAL_SKILLS = [
    "python",
    "java",
    "c",
    "c++",
    "javascript",
    "react",
    "next.js",
    "node.js",
    "express",
    "flask",
    "django",
    "mongodb",
    "mysql",
    "sql",
    "html",
    "css",
    "bootstrap",
    "tailwind",
    "git",
    "github",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "opencv",
    "nlp",
    "data science"
]


# ============================================================
# Soft Skills
# ============================================================

SOFT_SKILLS = [
    "communication",
    "leadership",
    "teamwork",
    "problem solving",
    "critical thinking",
    "time management",
    "adaptability",
    "creativity"
]


# ============================================================
# Helper: normalize skill names
# ============================================================

def normalize_skill(skill):
    """
    Normalize a skill name so that duplicates such as:

        "Python"
        "python"
        "PYTHON"

    are treated as the same skill.
    """

    if not isinstance(skill, str):
        return ""

    skill = skill.strip()

    # Remove excessive whitespace
    skill = re.sub(r"\s+", " ", skill)

    return skill


# ============================================================
# Helper: merge skill lists
# ============================================================

def merge_skills(existing, new_skills):
    """
    Merge two skill lists while removing duplicates.
    """

    combined = {}

    for skill in existing + new_skills:

        skill = normalize_skill(skill)

        if not skill:
            continue

        key = skill.lower()

        if key not in combined:
            combined[key] = skill

    return sorted(
        combined.values(),
        key=lambda x: x.lower()
    )


# ============================================================
# Main skill detector
# ============================================================

def detect_skills(text):

    if not text:
        return {
            "technicalSkills": [],
            "softSkills": []
        }

    text_lower = text.lower()

    technical = []
    soft = []


    # ========================================================
    # BRAIN 1
    # Rule-based dictionary matching
    # ========================================================

    for skill in TECHNICAL_SKILLS:

        # Escape special regex characters such as
        # +, ., etc.
        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

        if re.search(pattern, text_lower):
            technical.append(skill.title())


    for skill in SOFT_SKILLS:

        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

        if re.search(pattern, text_lower):
            soft.append(skill.title())


    # ========================================================
    # BRAIN 2
    # Groq contextual skill extraction
    # ========================================================

    try:

        if is_llm_available():

            system_prompt = """
You are a professional resume skill extraction system.

Extract skills that are explicitly supported by the provided
text.

Rules:

1. Never invent skills.
2. Only extract skills that are actually mentioned or clearly
   demonstrated in the text.
3. Technical skills include programming languages, frameworks,
   libraries, databases, tools, platforms, technologies,
   methodologies and technical domains.
4. Soft skills include interpersonal, communication,
   leadership, collaboration and workplace abilities.
5. Do not treat job titles as skills.
6. Do not treat company names as skills.
7. Do not return explanations.
8. Return ONLY valid JSON.
"""

            prompt = f"""
Extract professional skills from this text.

Return exactly this JSON structure:

{{
    "technicalSkills": [],
    "softSkills": []
}}

Text:

{text}
"""

            llm_skills = query_llm(
                prompt,
                system_prompt=system_prompt
            )


            if llm_skills and isinstance(llm_skills, dict):

                llm_tech = llm_skills.get(
                    "technicalSkills",
                    []
                )

                llm_soft = llm_skills.get(
                    "softSkills",
                    []
                )


                if not isinstance(llm_tech, list):
                    llm_tech = []


                if not isinstance(llm_soft, list):
                    llm_soft = []


                llm_tech = [
                    normalize_skill(skill)
                    for skill in llm_tech
                    if isinstance(skill, str)
                ]


                llm_soft = [
                    normalize_skill(skill)
                    for skill in llm_soft
                    if isinstance(skill, str)
                ]


                # =================================================
                # Merge Brain 1 + Brain 2
                # =================================================

                technical = merge_skills(
                    technical,
                    llm_tech
                )

                soft = merge_skills(
                    soft,
                    llm_soft
                )


    except Exception as e:

        print(
            f"[Groq Skill Detector] "
            f"Error extracting skills via LLM: {e}"
        )


    # ============================================================
    # Final result
    # ============================================================

    return {
        "technicalSkills": merge_skills(
            [],
            technical
        ),

        "softSkills": merge_skills(
            [],
            soft
        )
    }