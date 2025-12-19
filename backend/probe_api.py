import requests
import json

url = "https://reita-posthepatic-spirally.ngrok-free.dev/analyze-sentiment"

payloads_to_try = [
    {"text": "I am feeling very happy today"},
    {"message": "I am feeling very happy today"},
    {"content": "I am feeling very happy today"}
]

print(f"Probing URL: {url}")

for payload in payloads_to_try:
    print(f"\nTrying payload: {payload}")
    try:
        response = requests.post(url, json=payload, timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        if response.status_code == 200:
            print("SUCCESS! match found.")
            break
    except Exception as e:
        print(f"Error: {e}")
