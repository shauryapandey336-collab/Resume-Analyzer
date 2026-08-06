from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from nlp.skill_detector import detect_skills


def match_job(resume_text, job_description):

    if not resume_text or not job_description:

        return {

            "score": 0,

            "matchedSkills": [],

            "missingSkills": [],

            "recommendations": ["Resume or Job Description is empty."]

        }

    # -------------------------
    # TF-IDF Similarity
    # -------------------------

    vectorizer = TfidfVectorizer(stop_words="english")

    vectors = vectorizer.fit_transform([
        resume_text,
        job_description
    ])

    similarity = cosine_similarity(
        vectors[0],
        vectors[1]
    )[0][0]

    score = round(similarity * 100, 2)

    # -------------------------
    # Detect Skills
    # -------------------------

    resume = detect_skills(resume_text)

    job = detect_skills(job_description)

    resume_skills = set(
        skill.lower()
        for skill in resume.get("technicalSkills", [])
    )

    job_skills = set(
        skill.lower()
        for skill in job.get("technicalSkills", [])
    )

    matched = sorted(
        resume_skills & job_skills
    )

    missing = sorted(
        job_skills - resume_skills
    )

    recommendations = []

    if missing:

        for skill in missing:

            recommendations.append(
                f"Add {skill.title()} to your resume."
            )

    else:

        recommendations.append(
            "Excellent! Your resume covers all required technical skills."
        )

    return {

        "score": score,

        "matchedSkills": [
            skill.title() for skill in matched
        ],

        "missingSkills": [
            skill.title() for skill in missing
        ],

        "recommendations": recommendations

    }