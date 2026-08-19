import requests
import json

OLLAMA_HOST = "http://localhost:11434"
OLLAMA_MODEL = "llama3"

def is_ollama_available():
    """
    Check if local Ollama server is running and has the required model.
    """
    try:
        # Check if Ollama is up
        response = requests.get(f"{OLLAMA_HOST}/api/tags", timeout=1.5)
        if response.status_code != 200:
            return False
        
        # Verify model is available
        models = [m["name"] for m in response.json().get("models", [])]
        # Match model name either fully or with suffix
        return any(OLLAMA_MODEL in m for m in models)
    except Exception:
        return False

def query_ollama(prompt, system_prompt=None, timeout=50.0):
    """
    Query the local Ollama instance with Llama3, requesting JSON output.
    Returns parsed JSON dictionary, or None if Ollama fails.
    """
    if not is_ollama_available():
        print("[Ollama] Ollama service or model 'llama3' is not available.")
        return None

    url = f"{OLLAMA_HOST}/api/generate"
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "format": "json",
        "stream": False,
        "options": {
            "temperature": 0.2
        }
    }
    if system_prompt:
        payload["system"] = system_prompt

    try:
        print(f"[Ollama] Sending request to {OLLAMA_MODEL}...")
        response = requests.post(url, json=payload, timeout=timeout)
        if response.status_code == 200:
            result = response.json()
            response_text = result.get("response", "").strip()
            print("[Ollama] Response received successfully.")
            return json.loads(response_text)
        else:
            print(f"[Ollama] Error response: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.Timeout:
        print("[Ollama] Request timed out.")
        return None
    except json.JSONDecodeError as jde:
        print(f"[Ollama] Failed to parse JSON response: {jde}")
        return None
    except Exception as e:
        print(f"[Ollama] Unexpected error: {e}")
        return None
