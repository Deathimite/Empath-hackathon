import os
from dotenv import load_dotenv

print(f"CWD: {os.getcwd()}")
print(f"File exists .env: {os.path.exists('.env')}")
print(f"File content preview:")
try:
    with open('.env', 'r', encoding='utf-8') as f:
        print(f.read()[:50])
except Exception as e:
    print(f"Error reading .env: {e}")

load_dotenv()
key = os.getenv('OPENAI_API_KEY')
print(f"Loaded Key: {key[:10] if key else 'None'}")
print(f"Full Env: {list(os.environ.keys())}")
