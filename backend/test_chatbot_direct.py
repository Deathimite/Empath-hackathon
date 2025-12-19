import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from mlmodel.chatbot import get_chatbot
from mlmodel.emotion_analyzer import get_analyzer

try:
    print("1. Initializing EmotionAnalyzer...")
    analyzer = get_analyzer()
    print("   EmotionAnalyzer initialized.")
    
    print("\n2. Testing Emotion Analysis...")
    user_msg = "I feel anxious"
    emotion_result = analyzer.analyze(user_msg)
    print(f"   Result: {emotion_result}")

    print("\n3. Initializing Chatbot...")
    chatbot = get_chatbot()
    print("   Chatbot initialized.")
    
    print("\n4. Testing generate_response...")
    response = chatbot.generate_response(user_msg, emotion_result)
    print(f"\nResponse: {response}")
    
except Exception as e:
    print(f"\nERROR: {e}")
    import traceback
    traceback.print_exc()
