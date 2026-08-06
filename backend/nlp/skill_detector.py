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


def detect_skills(text):

    text = text.lower()

    technical = []

    soft = []

    for skill in TECHNICAL_SKILLS:

        if skill in text:

            technical.append(skill.title())

    for skill in SOFT_SKILLS:

        if skill in text:

            soft.append(skill.title())

    return {

        "technicalSkills": sorted(
            list(set(technical))
        ),

        "softSkills": sorted(
            list(set(soft))
        )

    }