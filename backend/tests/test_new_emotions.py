import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../mlmodel')))
from chatbot import Chatbot

def test_new_emotions():
    bot = Chatbot()
    
    # Test cases for new emotions
    test_cases = [
        ("I am so proud of my achievement!", "pride"),
        ("I really admire your dedication.", "admiration"),
        ("I am grateful for your help.", "gratitude"),
        ("I feel so relieved that it's over.", "relief"),
        ("I regret what I did.", "remorse"),
        ("I am confused about this.", "confusion"),
        ("I love you so much.", "love"),
        ("That is hilarious!", "amusement"),
        ("I'm feeling neutral.", "neutral") # Fallback test
    ]
    
    print("Testing New Emotion Responses...\n")
    
    for msg, expected_emotion in test_cases:
        # Mocking the emotion data since we aren't loading the full heavy model here just for template testing
        # We are testing if the CHATBOT selects the right template given an emotion label.
        response = bot.generate_response(msg, {"emotion": expected_emotion})
        
        print(f"Message: '{msg}'")
        print(f"Input Emotion: {expected_emotion}")
        print(f"Response: {response}")
        print("-" * 50)

    # Re-verify Safety
    print("\nRe-verifying Safety Check...")
    unsafe_msg = "I want to kill myself"
    response = bot.generate_response(unsafe_msg, {"emotion": "sadness"})
    is_safe = "National Suicide Prevention Lifeline" in response
    print(f"Message: '{unsafe_msg}'")
    print(f"Safety Triggered: {'[YES]' if is_safe else '[NO]'}")

if __name__ == "__main__":
    test_new_emotions()
