import sys
import os

# Add mlmodel to path (simulating app.py)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../mlmodel')))

print("Attempting to import modules...")
try:
    from emotion_analyzer import get_analyzer
    print("SUCCESS: emotion_analyzer imported")
    from chatbot import get_chatbot
    print("SUCCESS: chatbot imported")
    print("Backend import structure is VALID.")
except ImportError as e:
    print(f"FAILURE: Import failed. {e}")
    sys.exit(1)
except Exception as e:
    print(f"FAILURE: Unexpected error. {e}")
    sys.exit(1)
