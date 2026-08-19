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


from nlp.ollama_client import query_ollama, is_ollama_available

def detect_skills(text):

    text_lower = text.lower()

    technical = []

    soft = []

    # Rule-based hardcoded dictionary matching
    for skill in TECHNICAL_SKILLS:

        if skill in text_lower:

            technical.append(skill.title())

    for skill in SOFT_SKILLS:

        if skill in text_lower:

            soft.append(skill.title())

    # Try leveraging Ollama for dynamic skill extraction
    try:
        if is_ollama_available():
            prompt = f"""
Identify all professional skills mentioned in the following text.
Categorize them into 'technicalSkills' and 'softSkills'.
Format the output as a single JSON object. Ensure all fields are present:
- technicalSkills: (list of strings)
- softSkills: (list of strings)

Text:
{text}
"""
            llm_skills = query_ollama(prompt)
            if llm_skills and isinstance(llm_skills, dict):
                llm_tech = [str(s).title() for s in llm_skills.get("technicalSkills", [])]
                llm_soft = [str(s).title() for s in llm_skills.get("softSkills", [])]
                
                # Merge lists, removing duplicates
                technical = list(set(technical + llm_tech))
                soft = list(set(soft + llm_soft))
    except Exception as e:
        print(f"[Ollama Skill Detector] Error extracting skills via LLM: {e}")

    return {

        "technicalSkills": sorted(
            list(set(technical))
        ),

        "softSkills": sorted(
            list(set(soft))
        )

    }