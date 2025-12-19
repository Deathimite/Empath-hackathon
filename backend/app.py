from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sys
import os

# Add mlmodel to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../mlmodel')))

from emotion_analyzer import get_analyzer
from chatbot import get_chatbot
from database import get_database
import random
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Configure CORS based on environment
if os.getenv('FLASK_ENV') == 'production':
    # In production, only allow specific origins
    allowed_origins = os.getenv('CORS_ORIGINS', '').split(',')
    CORS(app, origins=allowed_origins, supports_credentials=True)
else:
    # In development, allow localhost (Vite)
    CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"], supports_credentials=True)

# Initialize components (lazy-loaded)
emotion_analyzer = None
chatbot = None
database = None
_components_initializing = False
_components_initialized = False

def initialize_components():
    """Initialize the analyzer, chatbot, and database."""
    global emotion_analyzer, chatbot, database, _components_initialized, _components_initializing
    if _components_initialized or _components_initializing:
        return
    _components_initializing = True
    print("Initializing components...")
    if database is None:
        database = get_database()
        print("Database initialized.")
    if emotion_analyzer is None:
        emotion_analyzer = get_analyzer()
        print("Emotion Analyzer initialized.")
    if chatbot is None:
        chatbot = get_chatbot()
        print("Chatbot initialized.")
    _components_initialized = True
    _components_initializing = False
    print("All components ready!")

@app.before_request
def ensure_initialized():
    """Lazy initialize on first request that needs components."""
    # Don't block health check
    if request.endpoint == 'health':
        return
    # Initialize if needed
    if not _components_initialized and not _components_initializing:
        initialize_components()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint - responds immediately."""
    status = "healthy" if _components_initialized else "initializing"
    return jsonify({
        "status": status, 
        "message": f"Empath.ai API is {status}"
    })

@app.route('/auth/register', methods=['POST'])
def register():
    """
    Register a new user.
    
    Expected JSON body:
    {
        "email": "user@example.com",
        "username": "username",
        "password": "password"
    }
    """
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        # Validation
        if not email or not username or not password:
            return jsonify({"error": "Email, username, and password are required"}), 400
        
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400
        
        # Check if user already exists
        existing_user = database.get_user_by_email(email)
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409
        
        # Register user
        user_id = database.register_user(email, username, password)
        
        if user_id:
            # Create session
            session['user_id'] = user_id
            session['email'] = email
            session['username'] = username
            
            return jsonify({
                "success": True,
                "message": "Registration successful",
                "user": {
                    "id": user_id,
                    "email": email,
                    "username": username
                }
            }), 201
        else:
            return jsonify({"error": "Registration failed"}), 500
    
    except Exception as e:
        print(f"Error in /auth/register endpoint: {e}")
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    """
    Login a user.
    
    Expected JSON body:
    {
        "email": "user@example.com",
        "password": "password"
    }
    """
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Authenticate user
        user = database.authenticate_user(email, password)
        
        if user:
            # Create session
            session['user_id'] = user['id']
            session['email'] = user['email']
            session['username'] = user['username']
            
            return jsonify({
                "success": True,
                "message": "Login successful",
                "user": {
                    "id": user['id'],
                    "email": user['email'],
                    "username": user['username']
                }
            })
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    
    except Exception as e:
        print(f"Error in /auth/login endpoint: {e}")
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

@app.route('/auth/logout', methods=['POST'])
def logout():
    """Logout the current user."""
    try:
        session.clear()
        return jsonify({"success": True, "message": "Logout successful"})
    except Exception as e:
        print(f"Error in /auth/logout endpoint: {e}")
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

@app.route('/auth/check', methods=['GET'])
def check_auth():
    """Check if user is authenticated."""
    try:
        if 'user_id' in session:
            user = database.get_user_by_id(session['user_id'])
            if user:
                return jsonify({
                    "authenticated": True,
                    "user": {
                        "id": user['id'],
                        "email": user['email'],
                        "username": user['username']
                    }
                })
        
        return jsonify({"authenticated": False})
    except Exception as e:
        print(f"Error in /auth/check endpoint: {e}")
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat():
    """
    Process a chat message and return an empathetic response.
    Requires authentication.
    
    Expected JSON body:
    {
        "message": "user's message text"
    }
    
    Returns:
    {
        "response": "chatbot's response",
        "emotion": "detected emotion",
        "confidence": 0.85,
        "timestamp": "ISO timestamp"
    }
    """
    try:
        # Check authentication
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        
        user_id = session['user_id']
        
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Check if components are initialized
        if emotion_analyzer is None:
            print("ERROR: emotion_analyzer is None!")
            return jsonify({"error": "Service initializing, please try again"}), 503
        
        if chatbot is None:
            print("ERROR: chatbot is None!")
            return jsonify({"error": "Service initializing, please try again"}), 503
        
        if database is None:
            print("ERROR: database is None!")
            return jsonify({"error": "Service initializing, please try again"}), 503
        
        # Analyze emotion
        try:
            # 1. Try External API first
            from mlmodel.external_sentiment import get_external_analyzer
            ext_analyzer = get_external_analyzer()
            print("Attempting external sentiment analysis...")
            emotion_data = ext_analyzer.analyze(user_message)
            print(f"External analysis result: {emotion_data}")
            
        except Exception as e:
            print(f"External API failed ({e}), falling back to local model...")
            # 2. Fallback to Local Model
            try:
                emotion_data = emotion_analyzer.analyze(user_message)
                # Mark as local source
                emotion_data['source'] = 'local_model'
                print(f"Local analysis result: {emotion_data}")
            except Exception as local_e:
                print(f"Local analysis error: {local_e}")
                import traceback
                traceback.print_exc()
                emotion_data = {"emotion": "neutral", "confidence": 0.5, "source": "fallback"}
        
        # Save user message to database
        try:
            database.save_conversation(
                user_id=user_id,
                message=user_message,
                sender='user',
                emotion=emotion_data.get('emotion'),
                confidence=emotion_data.get('confidence')
            )
        except Exception as e:
            print(f"Database save error: {e}")
        
        # Generate response
        try:
            response = chatbot.generate_response(user_message, emotion_data)
            print(f"Chatbot response: {response[:100]}...")
        except Exception as e:
            print(f"Chatbot error: {e}")
            import traceback
            traceback.print_exc()
            response = "I'm having a little trouble thinking clearly. Could you say that again?" 
        
        # Save bot response to database
        try:
            database.save_conversation(
                user_id=user_id,
                message=response,
                sender='bot'
            )
        except Exception as e:
            print(f"Database save bot response error: {e}")
        
        return jsonify({
            "response": response,
            "emotion": emotion_data.get("emotion"),
            "confidence": emotion_data.get("confidence"),
            "timestamp": datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"Error in /chat endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

@app.route('/analyze_emotion', methods=['POST'])
def analyze_emotion():
    """
    Analyze the emotion in a text without generating a response.
    
    Expected JSON body:
    {
        "text": "text to analyze"
    }
    
    Returns:
    {
        "emotion": "detected emotion",
        "confidence": 0.85,
        "all_emotions": {...}
    }
    """
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        emotion_data = emotion_analyzer.analyze(text)
        
        return jsonify(emotion_data)
    
    except Exception as e:
        print(f"Error in /analyze_emotion endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

@app.route('/mood_history', methods=['GET'])
def mood_history():
    """
    Get mock mood history data for the dashboard.
    
    Returns:
    {
        "history": [
            {"date": "2024-01-01", "emotion": "joy", "intensity": 8},
            ...
        ]
    }
    """
    # Generate mock data for the last 7 days
    mock_data = []
    emotions = ["joy", "sadness", "neutral", "fear", "anger"]
    
    for i in range(7):
        date = (datetime.now() - timedelta(days=6-i)).strftime("%Y-%m-%d")
        # Generate 1-3 entries per day
        num_entries = random.randint(1, 3)
        
        for _ in range(num_entries):
            mock_data.append({
                "date": date,
                "emotion": random.choice(emotions),
                "intensity": random.randint(5, 10),
                "timestamp": datetime.now().isoformat()
            })
    
    return jsonify({"history": mock_data})

if __name__ == '__main__':
    print("Starting Empath.ai Backend API...")
    print("Server starting... (models will load on first request)")
    
    # Get configuration from environment variables
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5001))
    # DISABLE debug mode to prevent Werkzeug reloader spawning duplicate processes
    debug = os.getenv('FLASK_DEBUG', '0') == '1'
    
    app.run(debug=debug, host=host, port=port)

@app.route('/history/<user_id>', methods=['GET'])
def get_history(user_id):
    """
    Get conversation history for a user.
    
    Query parameters:
    - limit: Number of messages to return (default: 50)
    
    Returns conversation history in reverse chronological order.
    """
    try:
        limit = request.args.get('limit', 50, type=int)
        
        # Get user ID from database
        user_db_id = database.create_user(user_id)
        
        # Get conversation history
        history = database.get_conversation_history(user_db_id, limit)
        
        return jsonify({
            "user_id": user_id,
            "history": history,
            "count": len(history)
        })
    
    except Exception as e:
        print(f"Error in /history endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

@app.route('/mood/track', methods=['POST'])
def track_mood():
    """
    Save a mood tracking entry.
    Requires authentication.
    
    Expected JSON body:
    {
        "emotion": "happy",
        "intensity": 8,
        "note": "optional note"
    }
    """
    try:
        # Check authentication
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        
        user_id = session['user_id']
        
        data = request.get_json()
        emotion = data.get('emotion')
        intensity = data.get('intensity', 5)
        note = data.get('note')
        
        if not emotion:
            return jsonify({"error": "emotion is required"}), 400
        
        entry_id = database.save_mood_entry(user_id, emotion, intensity, note)
        
        return jsonify({
            "success": True,
            "entry_id": entry_id,
            "timestamp": datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"Error in /mood/track endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

@app.route('/mood/history', methods=['GET'])
def get_mood_history_endpoint():
    """
    Get mood history for authenticated user.
    Requires authentication.
    
    Query parameters:
    - days: Number of days to look back (default: 7)
    """
    try:
        # Check authentication
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        
        user_id = session['user_id']
        days = request.args.get('days', 7, type=int)
        
        mood_history = database.get_mood_history(user_id, days)
        
        return jsonify({
            "mood_history": mood_history,
            "days": days
        })
    
    except Exception as e:
        print(f"Error in /mood/history endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

@app.route('/user/stats', methods=['GET'])
def get_user_stats_endpoint():
    """Get statistics for authenticated user. Requires authentication."""
    try:
        # Check authentication
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        
        user_id = session['user_id']
        stats = database.get_user_stats(user_id)
        
        return jsonify({"stats": stats})
    
    except Exception as e:
        print(f"Error in /user/stats endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500
