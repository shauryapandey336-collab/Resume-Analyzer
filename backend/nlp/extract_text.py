import fitz
import docx2txt
import os


def extract_text(file_path):

    text = ""

    extension = os.path.splitext(file_path)[1].lower()

    # PDF

    if extension == ".pdf":

        document = fitz.open(file_path)

        for page in document:

            text += page.get_text()

        document.close()

    # DOCX

    elif extension == ".docx":

        text = docx2txt.process(file_path)

    else:

        raise Exception("Unsupported File Format")

    return text