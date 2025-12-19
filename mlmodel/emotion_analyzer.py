from transformers import pipeline
import numpy as np

class EmotionAnalyzer:
    def __init__(self):
        """Initialize the emotion analyzer with a pre-trained model."""
        print("Loading emotion detection model...")
        try:
            # Using GoEmotions model (28 labels)
            self.classifier = pipeline(
                "text-classification",
                model="SamLowe/roberta-base-go_emotions",
                top_k=None
            )
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.classifier = None
    
    def analyze(self, text):
        """
        Analyze the emotion in the given text.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            dict: Dictionary containing emotion and confidence scores
        """
        if not self.classifier:
            return {
                "emotion": "neutral",
                "confidence": 0.5,
                "all_emotions": {}
            }
        
        try:
            results = self.classifier(text)[0]
            
            # Convert to a more readable format
            emotions = {}
            top_emotion = None
            top_score = 0
            
            for result in results:
                emotion = result['label'].lower()
                score = result['score']
                emotions[emotion] = score
                
                if score > top_score:
                    top_score = score
                    top_emotion = emotion
            
            return {
                "emotion": top_emotion,
                "confidence": top_score,
                "all_emotions": emotions
            }
        except Exception as e:
            print(f"Error analyzing emotion: {e}")
            return {
                "emotion": "neutral",
                "confidence": 0.5,
                "all_emotions": {}
            }

# Singleton instance
_analyzer = None

def get_analyzer():
    """Get or create the emotion analyzer instance."""
    global _analyzer
    if _analyzer is None:
        _analyzer = EmotionAnalyzer()
    return _analyzer
