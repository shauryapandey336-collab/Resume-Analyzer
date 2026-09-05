from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from nlp.skill_detector import detect_skills
from nlp.llm_client import query_llm, is_llm_available


def _safe_list(value):
    """Ensure an LLM field is always returned as a list."""
    return value if isinstance(value, list) else []


def _clean_skill_list(skills):
    """Normalize skill names for consistent comparison."""
    return sorted(
        {
            str(skill).strip().title()
            for skill in skills
            if str(skill).strip()
        }
    )


def match_job(
    resume_text,
    job_description,
    parsed_data=None,
    skills=None,
    ats_score=None,
    resume_score=0
):
    """
    Two-brain resume/job matching system.

    Brain 1:
        TF-IDF similarity
        + deterministic technical skill coverage

    Brain 2:
        Groq contextual reasoning

    Existing callers that only provide resume_text and
    job_description remain supported.
    """

    # =========================================================
    # INPUT VALIDATION
    # =========================================================

    if not resume_text or not job_description:
        return {
            "score": 0,
            "matchedSkills": [],
            "missingSkills": [],
            "recommendations": [
                "Resume or Job Description is empty."
            ],
            "contextualInsights": [],
            "priorityActions": [],
            "overallAssessment": "",
            "tfidfScore": 0,
            "skillCoverage": 0
        }

    parsed_data = parsed_data or {}
    skills = skills or {}
    ats_score = ats_score or {}

    # =========================================================
    # BRAIN 1A: TF-IDF SEMANTIC SIMILARITY
    # =========================================================

    try:

        vectorizer = TfidfVectorizer(
            stop_words="english"
        )

        vectors = vectorizer.fit_transform([
            resume_text,
            job_description
        ])

        similarity = cosine_similarity(
            vectors[0],
            vectors[1]
        )[0][0]

        tfidf_score = float(
            round(similarity * 100, 2)
        )

    except Exception as e:

        print(f"[TF-IDF] Error: {e}")

        tfidf_score = 0.0

    # =========================================================
    # BRAIN 1B: DETERMINISTIC SKILL MATCHING
    # =========================================================

    try:

        resume_skills_data = (
            skills
            if skills
            else detect_skills(resume_text)
        )

        job_skills_data = detect_skills(
            job_description
        )

        resume_skills = {
            str(skill).lower().strip()
            for skill in resume_skills_data.get(
                "technicalSkills",
                []
            )
        }

        job_skills = {
            str(skill).lower().strip()
            for skill in job_skills_data.get(
                "technicalSkills",
                []
            )
        }

    except Exception as e:

        print(f"[Skill Matching] Error: {e}")

        resume_skills = set()
        job_skills = set()

    matched = sorted(
        resume_skills & job_skills
    )

    missing = sorted(
        job_skills - resume_skills
    )

    # =========================================================
    # OBJECTIVE SKILL COVERAGE
    # =========================================================

    if job_skills:

        skill_coverage = float(
            round(
                (len(matched) / len(job_skills)) * 100,
                2
            )
        )

    else:

        skill_coverage = 0.0

    # =========================================================
    # OBJECTIVE BRAIN 1 SCORE
    #
    # 50% TF-IDF similarity
    # 50% technical skill coverage
    # =========================================================

    if job_skills:

        objective_score = float(
            round(
                (0.50 * tfidf_score)
                +
                (0.50 * skill_coverage),
                2
            )
        )

    else:

        objective_score = tfidf_score

    # =========================================================
    # RULE-BASED FALLBACK RECOMMENDATIONS
    # =========================================================

    fallback_recommendations = []

    if missing:

        fallback_recommendations.append(
            "Review the missing skills and only mention "
            "those that you genuinely possess."
        )

        for skill in missing:

            fallback_recommendations.append(
                f"Strengthen evidence for "
                f"{skill.title()} if you have "
                f"relevant experience."
            )

    else:

        fallback_recommendations.append(
            "Your resume covers the detected technical "
            "skills requested in the job description."
        )

    # =========================================================
    # BRAIN 2: GROQ CONTEXTUAL REASONING
    # =========================================================

    try:

        if is_llm_available():

            system_prompt = """
You are an expert resume analyst and job-fit evaluator.

Your task is to analyze how well a candidate's resume
actually aligns with a specific job description.

You are NOT a keyword stuffing assistant.

Your analysis must be evidence-based.

RULES:

1. Never invent candidate experience.

2. Never claim that the candidate possesses a skill unless
   the resume provides evidence for it.

3. Never recommend adding a skill simply because it appears
   in the job description.

4. Distinguish between:
   - clearly demonstrated skills
   - indirectly demonstrated or transferable skills
   - unsupported requirements

5. Recognize adjacent evidence.

For example:
   Flask -> backend/API development
   MongoDB -> database experience
   React -> frontend development
   Git/GitHub -> version control and collaboration

6. Consider the candidate's actual projects and experience.

7. Consider whether a missing requirement is critical or
   merely desirable.

8. Prefer improving evidence and positioning of genuine
   experience over keyword stuffing.

9. Recommendations must be actionable and personalized.

10. Do not punish a candidate simply because a niche
    technology is not explicitly mentioned if related
    experience is clearly demonstrated.

11. Return ONLY valid JSON.
"""

            prompt = f"""
Analyze this candidate against this specific job description.

=========================================================
TRADITIONAL NLP ANALYSIS
=========================================================

TF-IDF Similarity:
{tfidf_score}

Technical Skill Coverage:
{skill_coverage}

Objective Match Score:
{objective_score}

Detected Matched Technical Skills:
{_clean_skill_list(matched)}

Detected Missing Technical Skills:
{_clean_skill_list(missing)}

ATS Score:
{ats_score}

Overall Resume Score:
{resume_score}

=========================================================
STRUCTURED RESUME INFORMATION
=========================================================

{parsed_data}

=========================================================
FULL RESUME
=========================================================

{resume_text}

=========================================================
JOB DESCRIPTION
=========================================================

{job_description}

=========================================================
TASK
=========================================================

Go beyond keyword matching.

Determine:

1. What parts of the candidate's actual experience align
   strongly with this role?

2. Which job requirements are genuinely unsupported?

3. Which apparently missing requirements may have related
   evidence elsewhere in the resume?

4. What evidence is weak or poorly communicated?

5. What should the candidate improve first?

6. What should NOT be added unless the candidate genuinely
   has that experience?

Return exactly this JSON:

{{
    "matchedSkills": [],
    "missingSkills": [],
    "recommendations": [],
    "contextualInsights": [],
    "priorityActions": [],
    "overallAssessment": ""
}}

FIELD REQUIREMENTS:

matchedSkills:
List relevant skills genuinely supported by the resume.

missingSkills:
List important requirements that are not sufficiently
supported by the resume.

recommendations:
Give personalized and practical recommendations.

contextualInsights:
Explain insights that simple keyword matching would miss.

priorityActions:
Return the 3 most important actions the candidate should
take first.

overallAssessment:
Give a concise human-readable assessment of the candidate's
fit for THIS specific job.
"""

            llm_result = query_llm(
                prompt,
                system_prompt=system_prompt
            )

            if isinstance(llm_result, dict):

                # =================================================
                # VALIDATE LLM OUTPUT
                # =================================================

                llm_matched = _safe_list(
                    llm_result.get(
                        "matchedSkills"
                    )
                )

                llm_missing = _safe_list(
                    llm_result.get(
                        "missingSkills"
                    )
                )

                llm_recommendations = _safe_list(
                    llm_result.get(
                        "recommendations"
                    )
                )

                contextual_insights = _safe_list(
                    llm_result.get(
                        "contextualInsights"
                    )
                )

                priority_actions = _safe_list(
                    llm_result.get(
                        "priorityActions"
                    )
                )

                overall_assessment = (
                    llm_result.get(
                        "overallAssessment",
                        ""
                    )
                )

                if not isinstance(
                    overall_assessment,
                    str
                ):
                    overall_assessment = ""

                # =================================================
                # MERGE MATCHED SKILLS
                # =================================================

                combined_matched = {
                    str(skill).strip().title()
                    for skill in matched
                }

                combined_matched.update(
                    str(skill).strip().title()
                    for skill in llm_matched
                    if str(skill).strip()
                )

                # =================================================
                # MERGE MISSING SKILLS
                # =================================================

                combined_missing = {
                    str(skill).strip().title()
                    for skill in missing
                }

                combined_missing.update(
                    str(skill).strip().title()
                    for skill in llm_missing
                    if str(skill).strip()
                )

                # =================================================
                # IMPORTANT:
                # Never allow a skill to remain both matched
                # and missing.
                # =================================================

                matched_lower = {
                    skill.lower()
                    for skill in combined_matched
                }

                combined_missing = {
                    skill
                    for skill in combined_missing
                    if skill.lower()
                    not in matched_lower
                }

                # =================================================
                # RECOMMENDATIONS
                # =================================================

                final_recommendations = (
                    llm_recommendations
                    if llm_recommendations
                    else fallback_recommendations
                )

                return {

                    # Existing frontend fields
                    "score": objective_score,

                    "matchedSkills": sorted(
                        combined_matched
                    ),

                    "missingSkills": sorted(
                        combined_missing
                    ),

                    "recommendations":
                        final_recommendations,

                    # New contextual intelligence
                    "contextualInsights":
                        contextual_insights,

                    "priorityActions":
                        priority_actions,

                    "overallAssessment":
                        overall_assessment,

                    # Explainable Brain 1 metrics
                    "tfidfScore":
                        tfidf_score,

                    "skillCoverage":
                        skill_coverage
                }

    except Exception as e:

        print(
            "[Groq Job Matcher] "
            f"Contextual analysis failed: {e}"
        )

    # =========================================================
    # FALLBACK
    # =========================================================

    return {

        "score": objective_score,

        "matchedSkills": [
            skill.title()
            for skill in matched
        ],

        "missingSkills": [
            skill.title()
            for skill in missing
        ],

        "recommendations":
            fallback_recommendations,

        "contextualInsights": [],

        "priorityActions": [],

        "overallAssessment": "",

        "tfidfScore":
            tfidf_score,

        "skillCoverage":
            skill_coverage
    }