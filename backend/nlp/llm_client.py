import os
import json
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq


# ---------------------------------------------------------
# Load backend/.env explicitly
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


# ---------------------------------------------------------
# Configuration
# ---------------------------------------------------------

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
GROQ_TIMEOUT = int(os.getenv("GROQ_TIMEOUT", "45"))

# Fallback models to try if the primary fails
FALLBACK_MODELS = [
    "openai/gpt-oss-120b",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
]

_client = None


# ---------------------------------------------------------
# Groq Client
# ---------------------------------------------------------

def get_client():
    global _client

    if _client is None:
        if not GROQ_API_KEY:
            return None

        _client = Groq(
            api_key=GROQ_API_KEY,
            timeout=GROQ_TIMEOUT
        )

    return _client


# ---------------------------------------------------------
# Availability
# ---------------------------------------------------------

def is_llm_available():
    return bool(GROQ_API_KEY)


# ---------------------------------------------------------
# LLM Query
# ---------------------------------------------------------

def query_llm(prompt, system_prompt=None, timeout=None, json_mode=True):

    client = get_client()

    if client is None:
        print("Groq LLM unavailable: GROQ_API_KEY is not configured.")
        return None

    messages = []

    if system_prompt:
        messages.append({
            "role": "system",
            "content": system_prompt
        })

    messages.append({
        "role": "user",
        "content": prompt
    })

    request_args = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": 0.2,
    }

    if json_mode:
        request_args["response_format"] = {
            "type": "json_object"
        }

    if timeout is not None:
        request_args["timeout"] = timeout

    # Try primary model first, then fallbacks
    models_to_try = [GROQ_MODEL] + [
        m for m in FALLBACK_MODELS if m != GROQ_MODEL
    ]

    for model_id in models_to_try:
        try:
            request_args["model"] = model_id
            response = client.chat.completions.create(
                **request_args
            )

            content = response.choices[0].message.content

            if not content:
                continue

            if json_mode:
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    return content

            return content

        except Exception as e:
            print(f"Groq LLM error with model '{model_id}': {e}")
            continue

    print("All Groq models failed.")
    return None