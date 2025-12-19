import os
from dotenv import load_dotenv
from openai import OpenAI

# 1. Load env
load_dotenv()
key = os.getenv('OPENAI_API_KEY')
print(f"API Key present: {bool(key)}")
if key:
    print(f"Key prefix: {key[:8]}...")

# 2. Try Client Init
try:
    client = OpenAI(api_key=key)
    print("Client initialized.")
except Exception as e:
    print(f"Client init failed: {e}")
    exit(1)

# 3. Try API Call
print("Attempting API call...")
try:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Are you working?"}],
        max_tokens=10
    )
    print("API Success!")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"API Failed: {e}")
