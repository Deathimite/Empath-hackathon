import requests
import time
import sys

BASE_URL = "http://localhost:5000"

def wait_for_server():
    print("Waiting for server...")
    for i in range(30):
        try:
            response = requests.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                print("Server is up!")
                return True
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(1)
        print(".", end="", flush=True)
    print("\nServer failed to start")
    return False

def test_registration():
    print("\nTesting Registration...")
    payload = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 201

def test_login():
    print("\nTesting Login...")
    payload = {
        "email": "test@example.com",
        "password": "password123"
    }
    session = requests.Session()
    response = session.post(f"{BASE_URL}/auth/login", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        # Test protected endpoint with session
        print("\nTesting Protected Endpoint (Auth Check)...")
        check_response = session.get(f"{BASE_URL}/auth/check")
        print(f"Check Status: {check_response.status_code}")
        print(f"Check Response: {check_response.json()}")
        return check_response.json().get("authenticated") is True
    return False

if __name__ == "__main__":
    if wait_for_server():
        reg_success = test_registration()
        login_success = test_login()
        
        if reg_success and login_success:
            print("\n✅ Authentication Verification Passed!")
            sys.exit(0)
        else:
            print("\n❌ Verification Failed")
            sys.exit(1)
