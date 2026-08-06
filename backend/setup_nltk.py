import nltk

resources = [
    "punkt",
    "punkt_tab",
    "stopwords",
    "wordnet",
    "omw-1.4",
]

for resource in resources:
    try:
        nltk.download(resource)
        print(f"{resource} downloaded")
    except Exception as e:
        print(f"Error downloading {resource}: {e}")

print("All NLTK resources checked.")