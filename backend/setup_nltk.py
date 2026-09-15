import os
import nltk

# backend folder ka path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# NLTK resources yahan store honge
NLTK_DATA_PATH = os.path.join(BASE_DIR, "nltk_data")

# Folder create karo agar exist nahi karta
os.makedirs(NLTK_DATA_PATH, exist_ok=True)

# NLTK ko custom path batao
if NLTK_DATA_PATH not in nltk.data.path:
    nltk.data.path.insert(0, NLTK_DATA_PATH)

# Required NLTK resources
resources = [
    "stopwords",
    "punkt",
    "punkt_tab",
    "wordnet",
    "omw-1.4"
]

print("=" * 60)
print("Downloading NLTK resources...")
print("=" * 60)

for resource in resources:
    print(f"Downloading: {resource}")

    try:
        success = nltk.download(
            resource,
            download_dir=NLTK_DATA_PATH,
            quiet=False
        )

        if success:
            print(f"✓ {resource} downloaded successfully")
        else:
            print(f"✗ Failed to download {resource}")

    except Exception as e:
        print(f"✗ Error downloading {resource}: {e}")

print("=" * 60)
print("NLTK setup completed")
print(f"NLTK data path: {NLTK_DATA_PATH}")
print("=" * 60)