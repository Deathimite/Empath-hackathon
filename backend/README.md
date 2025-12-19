# Empath.ai Backend

This is the Python Flask backend for the Empath.ai application.

## Features

- **Emotion Detection**: Uses Hugging Face transformers to detect emotions in text
- **Empathetic Responses**: Generates context-aware, supportive responses based on detected emotions
- **REST API**: Provides endpoints for the React frontend to consume

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /chat
Process a chat message and return an empathetic response.

**Request:**
```json
{
  "message": "I'm feeling really stressed today"
}
```

**Response:**
```json
{
  "response": "I hear that you're feeling stressed...",
  "emotion": "fear",
  "confidence": 0.85,
  "timestamp": "2024-01-01T12:00:00"
}
```

### POST /analyze_emotion
Analyze emotion without generating a response.

**Request:**
```json
{
  "text": "I'm so happy!"
}
```

**Response:**
```json
{
  "emotion": "joy",
  "confidence": 0.92,
  "all_emotions": {
    "joy": 0.92,
    "sadness": 0.02,
    ...
  }
}
```

### GET /mood_history
Get mock mood history data for visualization.

**Response:**
```json
{
  "history": [
    {
      "date": "2024-01-01",
      "emotion": "joy",
      "intensity": 8
    }
  ]
}
```

### GET /history/:user_id
Get conversation history for a user.

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 50)

**Response:**
```json
{
  "user_id": "user_123",
  "history": [
    {
      "message": "I'm feeling stressed",
      "sender": "user",
      "emotion": "fear",
      "confidence": 0.85,
      "timestamp": "2024-01-01T12:00:00"
    }
  ],
  "count": 1
}
```

### POST /mood/track
Save a mood tracking entry.

**Request:**
```json
{
  "user_id": "user_123",
  "emotion": "happy",
  "intensity": 8,
  "note": "Had a great day!"
}
```

### GET /mood/history/:user_id
Get mood history for a user.

**Query Parameters:**
- `days` (optional): Number of days to look back (default: 7)

### GET /user/stats/:user_id
Get statistics for a user.

**Response:**
```json
{
  "user_id": "user_123",
  "stats": {
    "total_conversations": 45,
    "most_common_emotion": "joy",
    "days_active": 7
  }
}
```

## Database

The backend uses SQLite to store:
- **Users**: User accounts and activity
- **Conversations**: Chat history with emotion detection
- **Mood Entries**: Manual mood tracking entries
- **User Preferences**: User settings

Database file: `mindfulchat.db` (created automatically)

## Model

The backend uses the `j-hartmann/emotion-english-distilroberta-base` model from Hugging Face, which classifies text into the following emotions:
- Joy
- Sadness
- Anger
- Fear
- Surprise
- Disgust
- Neutral
