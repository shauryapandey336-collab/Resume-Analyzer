import re


def parse_resume(text):

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