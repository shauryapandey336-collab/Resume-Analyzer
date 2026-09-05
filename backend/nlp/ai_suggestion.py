from nlp.llm_client import query_llm, is_llm_available


def generate_ai_suggestions(
    resume_text,
    parsed_data,
    skills,
    ats_score,
    resume_score
):
    """
    Generate personalized resume improvement suggestions.

    Primary intelligence:
        Groq LLM

    Fallback:
        Rule-based NLP

    The existing response format is preserved:
        strengths
        weaknesses
        suggestions

    Additional contextual fields may also be returned without
    breaking the existing frontend.
    """

    # ============================================================
    # Validate inputs
    # ============================================================

    if not resume_text:
        return {
            "strengths": [],
            "weaknesses": [
                "Resume text could not be analyzed."
            ],
            "suggestions": [
                "Upload a valid resume containing readable text."
            ]
        }

    parsed_data = parsed_data or {}
    skills = skills or {}

    # ============================================================
    # Extract existing structured information
    # ============================================================

    technical = skills.get(
        "technicalSkills",
        []
    )

    soft = skills.get(
        "softSkills",
        []
    )

    education = parsed_data.get(
        "education",
        []
    )

    experience = parsed_data.get(
        "experience",
        []
    )

    projects = parsed_data.get(
        "projects",
        []
    )

    # ============================================================
    # BRAIN 2: Groq contextual resume analysis
    # ============================================================

    try:

        if is_llm_available():

            system_prompt = """
You are an expert ATS resume reviewer and career advisor.

Analyze the candidate's resume using the structured information
and resume text provided.

Your goal is to give personalized and realistic advice.

IMPORTANT RULES:

1. Never invent candidate experience.
2. Never tell the candidate to claim a skill they do not have.
3. Do not recommend keyword stuffing.
4. Distinguish between missing information and missing skills.
5. Recognize transferable or indirectly demonstrated skills.
6. Focus on evidence, clarity, impact, relevance and ATS
   compatibility.
7. Recommendations must be actionable.
8. Avoid generic advice whenever the resume provides enough
   information to give specific advice.
9. If something is missing, explain why it matters.
10. Do not assume the candidate has professional experience
    if the resume only contains academic projects.
11. Give student-friendly advice when the candidate appears
    to be a student or early-career candidate.
12. Return ONLY valid JSON.
"""

            prompt = f"""
Analyze the following candidate resume.

==============================
STRUCTURED RESUME INFORMATION
==============================

Name:
{parsed_data.get('name', 'Not found')}

Email:
{parsed_data.get('email', 'Not found')}

Phone:
{parsed_data.get('phone', 'Not found')}

GitHub:
{parsed_data.get('github', 'Not found')}

LinkedIn:
{parsed_data.get('linkedin', 'Not found')}

Technical Skills:
{technical}

Soft Skills:
{soft}

Education:
{education}

Experience:
{experience}

Projects:
{projects}

ATS Compatibility Score:
{ats_score}/100

Resume Completeness Score:
{resume_score}/100


==============================
RESUME TEXT
==============================

{resume_text[:5000]}


==============================
TASK
==============================

Evaluate the resume as a real recruiter and ATS reviewer.

Identify:

1. Genuine strengths.
2. Specific weaknesses.
3. Concrete improvements.

Pay particular attention to:

- skill presentation
- project descriptions
- experience descriptions
- measurable achievements
- professional summary
- ATS compatibility
- clarity
- relevance
- contact information
- GitHub / LinkedIn presence
- education
- technical evidence
- use of action-oriented language
- unnecessary or weak content


Return EXACTLY this JSON structure:

{{
    "strengths": [],
    "weaknesses": [],
    "suggestions": [],
    "priorityActions": [],
    "contextualInsights": [],
    "overallAssessment": ""
}}
Requirements:

strengths:
List 3-6 specific strengths supported by the resume.

weaknesses:
List 3-6 specific weaknesses or improvement areas.

suggestions:
List 4-8 actionable recommendations.

priorityActions:
List the 3 most important improvements the candidate
should make first.

contextualInsights:
List observations that a simple keyword-based ATS
would probably miss.

overallAssessment:
Write a short personalized assessment of the resume.
"""

            llm_result = query_llm(
                prompt,
                system_prompt=system_prompt
            )

            # ====================================================
            # Validate Groq response
            # ====================================================

            if llm_result and isinstance(llm_result, dict):

                strengths = llm_result.get(
                    "strengths",
                    []
                )

                weaknesses = llm_result.get(
                    "weaknesses",
                    []
                )

                suggestions = llm_result.get(
                    "suggestions",
                    []
                )

                priority_actions = llm_result.get(
                    "priorityActions",
                    []
                )

                contextual_insights = llm_result.get(
                    "contextualInsights",
                    []
                )

                overall_assessment = llm_result.get(
                    "overallAssessment",
                    ""
                )

                # ------------------------------------------------
                # Ensure expected types
                # ------------------------------------------------

                if not isinstance(strengths, list):
                    strengths = []

                if not isinstance(weaknesses, list):
                    weaknesses = []

                if not isinstance(suggestions, list):
                    suggestions = []

                if not isinstance(priority_actions, list):
                    priority_actions = []

                if not isinstance(contextual_insights, list):
                    contextual_insights = []

                # ------------------------------------------------
                # Clean returned values
                # ------------------------------------------------

                strengths = [
                    str(item).strip()
                    for item in strengths
                    if str(item).strip()
                ]

                weaknesses = [
                    str(item).strip()
                    for item in weaknesses
                    if str(item).strip()
                ]

                suggestions = [
                    str(item).strip()
                    for item in suggestions
                    if str(item).strip()
                ]

                priority_actions = [
                    str(item).strip()
                    for item in priority_actions
                    if str(item).strip()
                ]

                contextual_insights = [
                    str(item).strip()
                    for item in contextual_insights
                    if str(item).strip()
                ]

                # ------------------------------------------------
                # Remove duplicates
                # ------------------------------------------------

                strengths = list(
                    dict.fromkeys(strengths)
                )

                weaknesses = list(
                    dict.fromkeys(weaknesses)
                )

                suggestions = list(
                    dict.fromkeys(suggestions)
                )

                priority_actions = list(
                    dict.fromkeys(priority_actions)
                )

                contextual_insights = list(
                    dict.fromkeys(contextual_insights)
                )

                # ------------------------------------------------
                # Return Groq analysis
                #
                # Existing frontend fields are preserved.
                # Additional fields are available for future use.
                # ------------------------------------------------

                return {
                    "strengths": strengths,
                    "weaknesses": weaknesses,
                    "suggestions": suggestions,

                    "priorityActions": priority_actions,

                    "contextualInsights": contextual_insights,

                    "overallAssessment": str(
                        overall_assessment
                    ).strip()
                }

    except Exception as e:

        print(
            f"[Groq Suggestion Generator] "
            f"Error generating suggestions via LLM: {e}"
        )

    # ============================================================
    # BRAIN 1 FALLBACK: Rule-based suggestions
    # ============================================================

    print(
        "[Groq Suggestion Generator] "
        "Falling back to rule-based suggestions."
    )

    strengths = []
    weaknesses = []
    suggestions = []

    text = resume_text.lower()

    # ============================================================
    # Technical skills
    # ============================================================

    if len(technical) >= 5:

        strengths.append(
            "Strong technical skill set detected."
        )

    else:

        weaknesses.append(
            "Technical skills are limited."
        )

        suggestions.append(
            "Highlight relevant technical skills that are "
            "genuinely supported by your experience."
        )

    # ============================================================
    # Soft skills
    # ============================================================

    if len(soft) >= 3:

        strengths.append(
            "Good range of soft skills mentioned."
        )

    else:

        weaknesses.append(
            "Limited soft skills were detected."
        )

        suggestions.append(
            "Include relevant soft skills and support them "
            "with examples from projects, internships or "
            "academic work."
        )

    # ============================================================
    # Professional summary
    # ============================================================

    if (
        "summary" not in text
        and "objective" not in text
        and "profile" not in text
    ):

        weaknesses.append(
            "Professional summary not found."
        )

        suggestions.append(
            "Add a concise professional summary explaining "
            "your technical focus, experience level and "
            "career direction."
        )

    else:

        strengths.append(
            "Professional summary or objective detected."
        )

    # ============================================================
    # GitHub
    # ============================================================

    github = parsed_data.get(
        "github",
        ""
    )

    if github or "github.com" in text:

        strengths.append(
            "GitHub profile detected."
        )

    else:

        weaknesses.append(
            "GitHub profile missing."
        )

        suggestions.append(
            "Add your GitHub profile if you have relevant "
            "projects available."
        )

    # ============================================================
    # LinkedIn
    # ============================================================

    linkedin = parsed_data.get(
        "linkedin",
        ""
    )

    if linkedin or "linkedin.com" in text:

        strengths.append(
            "LinkedIn profile detected."
        )

    else:

        weaknesses.append(
            "LinkedIn profile missing."
        )

        suggestions.append(
            "Add your LinkedIn profile if it is professionally "
            "maintained."
        )

    # ============================================================
    # Projects
    # ============================================================

    if len(projects) > 0:

        strengths.append(
            f"{len(projects)} project(s) detected."
        )

    else:

        weaknesses.append(
            "Projects section missing."
        )

        suggestions.append(
            "Add relevant academic or personal projects "
            "that demonstrate your technical abilities."
        )

    # ============================================================
    # Experience
    # ============================================================

    if len(experience) > 0:

        strengths.append(
            "Experience section detected."
        )

    else:

        weaknesses.append(
            "Professional experience section missing."
        )

        suggestions.append(
            "If you have internships, freelance work, research "
            "or relevant practical experience, include them."
        )

    # ============================================================
    # Education
    # ============================================================

    if len(education) > 0:

        strengths.append(
            "Education details available."
        )

    else:

        weaknesses.append(
            "Education details missing."
        )

        suggestions.append(
            "Add your relevant educational qualifications."
        )

    # ============================================================
    # ATS score
    # ============================================================

    if ats_score < 80:

        suggestions.append(
            "Improve ATS compatibility by using relevant "
            "terminology naturally and making important "
            "skills and experience easy to identify."
        )

    # ============================================================
    # Resume score
    # ============================================================

    if resume_score < 75:

        suggestions.append(
            "Improve the overall structure, clarity and "
            "content quality of the resume."
        )

    # ============================================================
    # Remove duplicates
    # ============================================================

    strengths = list(
        dict.fromkeys(strengths)
    )

    weaknesses = list(
        dict.fromkeys(weaknesses)
    )

    suggestions = list(
        dict.fromkeys(suggestions)
    )

    # ============================================================
    # Final fallback response
    # ============================================================

    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions,

        "priorityActions": suggestions[:3],

        "contextualInsights": [],

        "overallAssessment": ""
    }