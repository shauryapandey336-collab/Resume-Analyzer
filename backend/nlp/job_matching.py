from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from nlp.skill_detector import detect_skills
from nlp.ollama_client import query_ollama, is_ollama_available


def match_job(resume_text, job_description):

    if not resume_text or not job_description:

        return {

            "score": 0,

            "matchedSkills": [],

            "missingSkills": [],

            "recommendations": ["Resume or Job Description is empty."]

        }

    # -------------------------
    # TF-IDF Cosine Similarity
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

    tfidf_score = round(similarity * 100, 2)

    # -------------------------
    # Rule-Based Skill Matching
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

    # -------------------------
    # Try leveraging Ollama
    # -------------------------
    try:
        if is_ollama_available():
            prompt = f"""
Analyze the match between the candidate's resume and the job description.
Extract:
1. Matched Skills: technical or professional skills present in both the resume and the job description.
2. Missing Skills: key skills requested in the job description but not mentioned in the resume.
3. Match Score: a percentage score between 0 and 100 representing how well the candidate's experience and skills align with the job description.
4. Recommendations: clear, actionable suggestions to tailor the resume for this job description.

Format the output as a single JSON object. Ensure all fields are present:
- matchedSkills: (list of strings)
- missingSkills: (list of strings)
- matchScore: (number)
- recommendations: (list of strings)

Resume Text:
{resume_text}

Job Description:
{job_description}
"""
            llm_result = query_ollama(prompt)
            if llm_result and isinstance(llm_result, dict):
                llm_score = float(llm_result.get("matchScore", tfidf_score))
                
                # Blend the TF-IDF score and LLM score (40% TF-IDF, 60% LLM)
                hybrid_score = round((0.40 * tfidf_score) + (0.60 * llm_score), 2)
                
                llm_matched = [s.title() for s in llm_result.get("matchedSkills", [])]
                llm_missing = [s.title() for s in llm_result.get("missingSkills", [])]
                
                # Merge rule-based and LLM-based matched/missing skills
                combined_matched = sorted(list(set([m.title() for m in matched] + llm_matched)))
                combined_missing = sorted(list(set([m.title() for m in missing] + llm_missing)))
                
                # Remove from missing if they are in matched
                combined_missing = [m for m in combined_missing if m not in combined_matched]
                
                combined_recs = llm_result.get("recommendations", recommendations)
                if not combined_recs:
                    combined_recs = recommendations

                return {
                    "score": hybrid_score,
                    "matchedSkills": combined_matched,
                    "missingSkills": combined_missing,
                    "recommendations": combined_recs
                }
    except Exception as e:
        print(f"[Ollama Job Matcher] Error performing job match via LLM: {e}")

    # Fallback to pure TF-IDF / rule-based job matching
    return {

        "score": tfidf_score,

        "matchedSkills": [
            skill.title() for skill in matched
        ],

        "missingSkills": [
            skill.title() for skill in missing
        ],

        "recommendations": recommendations

    }