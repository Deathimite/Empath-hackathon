import requests
import os
import time

class ExternalSentimentAnalyzer:
    def __init__(self):
        """Initialize with API URL from environment."""
        self.api_url = os.getenv('EXTERNAL_SENTIMENT_URL')
        if not self.api_url:
            print("WARNING: EXTERNAL_SENTIMENT_URL not set.")
    
    def analyze(self, text):
        """
        Analyze text using external API. 
        Returns dict with 'emotion' and 'confidence'.
        Raises Exception on failure so caller can fallback to local model.
        """
        if not self.api_url:
            raise Exception("External API URL not configured")
            
        payload = {"text": text}
        
        try:
            # 10s timeout for network latency
            response = requests.post(self.api_url, json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                # Expected format: {"label": "joy", "score": 0.95} or {"emotion": "joy", ...}
                # We normalize it to our format: {'emotion': str, 'confidence': float}
                
                emotion = data.get('label') or data.get('emotion') or 'neutral'
                confidence = data.get('score') or data.get('confidence') or 0.0
                
                return {
                    "emotion": emotion,
                    "confidence": float(confidence),
                    "source": "external_api"
                }
            else:
                raise Exception(f"API returned status {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error: {e}")

# Singleton
_analyzer = None

def get_external_analyzer():
    global _analyzer
    if _analyzer is None:
        _analyzer = ExternalSentimentAnalyzer()
    return _analyzer
