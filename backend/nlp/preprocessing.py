import os
import re
import nltk

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


# =========================================================
# NLTK DATA CONFIGURATION
# =========================================================

# backend folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# backend/nltk_data
NLTK_DATA_PATH = os.path.join(BASE_DIR, "nltk_data")

# Ensure directory exists
os.makedirs(NLTK_DATA_PATH, exist_ok=True)

# Tell NLTK where resources are stored
if NLTK_DATA_PATH not in nltk.data.path:
    nltk.data.path.insert(0, NLTK_DATA_PATH)


# =========================================================
# STOPWORDS
# =========================================================

try:
    stop_words = set(stopwords.words("english"))

except LookupError:
    # Safety fallback
    nltk.download(
        "stopwords",
        download_dir=NLTK_DATA_PATH,
        quiet=True
    )

    stop_words = set(stopwords.words("english"))


# =========================================================
# PREPROCESS TEXT
# =========================================================

def preprocess_text(text):
    """
    Clean and preprocess resume text.

    Steps:
    1. Convert to string
    2. Convert to lowercase
    3. Remove URLs
    4. Remove email addresses
    5. Remove special characters
    6. Tokenize text
    7. Remove stopwords
    8. Return cleaned text
    """

    if not text:
        return ""

    # Ensure string
    text = str(text)

    # Lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(
        r"https?://\S+|www\.\S+",
        " ",
        text
    )

    # Remove email addresses
    text = re.sub(
        r"\S+@\S+",
        " ",
        text
    )

    # Keep alphabets, numbers, +, #, . and spaces
    # This is useful for skills like:
    # C++, C#, Node.js, Next.js, etc.
    text = re.sub(
        r"[^a-zA-Z0-9+#.\s]",
        " ",
        text
    )

    # Remove extra spaces
    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    # Tokenization
    try:
        tokens = word_tokenize(text)

    except LookupError:
        # Safety fallback if punkt is missing
        nltk.download(
            "punkt",
            download_dir=NLTK_DATA_PATH,
            quiet=True
        )

        try:
            nltk.download(
                "punkt_tab",
                download_dir=NLTK_DATA_PATH,
                quiet=True
            )
        except Exception:
            pass

        tokens = word_tokenize(text)

    # Remove stopwords
    tokens = [
        word
        for word in tokens
        if word not in stop_words
    ]

    # Final cleaned text
    cleaned_text = " ".join(tokens)

    return cleaned_text