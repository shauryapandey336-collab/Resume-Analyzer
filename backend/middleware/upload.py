import os
import uuid

from werkzeug.utils import secure_filename
from flask import current_app


ALLOWED_EXTENSIONS = {
    "pdf",
    "docx"
}


def allowed_file(filename):

    return (
        "." in filename and
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def save_resume(file):

    if file is None:

        raise Exception("No file uploaded")

    if file.filename == "":

        raise Exception("File name is empty")

    if not allowed_file(file.filename):

        raise Exception(
            "Only PDF and DOCX files are allowed"
        )

    extension = file.filename.rsplit(".", 1)[1].lower()

    filename = (
        str(uuid.uuid4())
        + "."
        + extension
    )

    filename = secure_filename(filename)

    upload_folder = current_app.config["UPLOAD_FOLDER"]

    if not os.path.exists(upload_folder):

        os.makedirs(upload_folder)

    filepath = os.path.join(
        upload_folder,
        filename
    )

    file.save(filepath)

    return filename, filepath