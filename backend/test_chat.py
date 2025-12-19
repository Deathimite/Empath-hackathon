import requests
import json

# URL of the backend
BASE_URL = "http://localhost:5001"

import time
timestamp = int(time.time())
email = f"test{timestamp}@test.com"

# 1. Login/Register to get a session cookie
print(f"1. Registering/Logging in as {email}...")
session = requests.Session()
login_payload = {
    "email": email, 
    "password": "password123" 
}

# Try to register first just in case
print("   Attempting registration...")
reg_response = session.post(f"{BASE_URL}/auth/register", json={
    "username": "Test User",
    "email": email,
    "password": "password123"
})
print(f"   Registration status: {reg_response.status_code}")

login_response = session.post(f"{BASE_URL}/auth/login", json=login_payload)
print(f"   Login status: {login_response.status_code}")

if login_response.status_code == 200:
    print("   Login successful!")
    
    # 2. Send a chat message
    # 2. Send varied chat messages
    messages = [
        "I am so confused about what to do.",
        "I am really proud of what I achieved."
    ]
    
    print("\n2. Sending chat messages...")
    
    for msg in messages:
        print(f"\n   Sending: '{msg}'")
        chat_payload = {"message": msg}
        
        try:
            chat_response = session.post(f"{BASE_URL}/chat", json=chat_payload)
            print(f"   Chat status: {chat_response.status_code}")
            print(f"   Response body: {chat_response.text}")
        except Exception as e:
            print(f"   Error sending request: {e}")

else:
    print(f"   Login failed: {login_response.text}")
