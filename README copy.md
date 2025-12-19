# Empath.ai - Mental Health Support Chatbot

A compassionate AI-powered chatbot that provides emotional support and mood tracking capabilities.

![Empath.ai Interface](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Empath.ai)

## 🌟 Features

- **Empathetic Chat Interface**: AI-powered conversations that detect emotional tone and respond with empathy.
- **Advanced Emotion Detection**: Uses the **GoEmotions** model to detect **28 distinct emotions** (e.g., Joy, Grief, Admiration, Remorse) for highly nuanced responses.
- **Crisis Intervention**: Built-in safety mechanisms to detect crisis keywords and provide immediate helpline resources.
- **Mood Analytics**: Track your emotional patterns over time with visual dashboards.
- **Coping Strategies**: Evidence-based techniques for emotional wellbeing.
- **Secure Authentication**: User accounts with password hashing and session management.
- **Privacy-Focused**: All conversations are processed locally.

## 🏗️ Architecture

### Frontend (`/frontend`)
- **Framework**: React with TypeScript
- **State**: React Hooks + Local Storage
- **UI Library**: shadcn/ui components + Tailwind CSS
- **Structure**:
  - `src/pages`: Main views (Login, Chat, Dashboard)
  - `src/api-int`: Centralized API integration
  - `src/components`: Reusable UI components

### Backend (`/backend`)
- **Framework**: Flask with CORS
- **Database**: SQLite (local `mindfulchat.db`)
- **Auth**: Bcrypt password hashing + Server-side sessions
- **Endpoints**:
  - `/auth/*`: Login/Register
  - `/chat`: Main chat interface
  - `/mood/*`: Mood tracking & analytics

### ML Model (`/mlmodel`)
- **Model**: `SamLowe/roberta-base-go_emotions`
- **Capabilities**: Classifies text into 28 emotional categories.
- **Logic**: Custom response templates for every emotion.

## 🚀 Getting Started

### Prerequisites
- **Node.js (v16+)** & **npm**
- **Python 3.8+** & **pip**

### 1️⃣ Backend Setup
The backend handles the AI logic and database.

```bash
cd backend

# Create virtual environment (Recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```
*Server runs at `http://localhost:5000`*

### 2️⃣ Frontend Setup
The frontend is the React user interface.

```bash
cd frontend

# Install dependencies (First time only)
npm install

# Start development server
npm run dev
```
*Frontend runs at `http://localhost:5173`*

## 📁 Project Structure

```
HACKATHON/
├── frontend/           # React Application
│   ├── src/
│   │   ├── pages/      # Login, Chat, Dashboard
│   │   ├── api-int/    # API Services
│   │   └── components/ # UI Elements
│   ├── package.json
│   └── vite.config.ts
├── backend/            # Flask Server
│   ├── app.py          # Main Entry Point
│   ├── database.py     # SQLite Manager
│   └── tests/          # Unit Tests
├── mlmodel/            # AI Logic
│   ├── emotion_analyzer.py
│   └── chatbot.py
└── README.md
```

## 🧠 AI Model
We utilize the `SamLowe/roberta-base-go_emotions` model to identify **28 distinct emotions**:
*Admiration, Amusement, Anger, Annoyance, Approval, Caring, Confusion, Curiosity, Desire, Disappointment, Disapproval, Disgust, Embarrassment, Excitement, Fear, Gratitude, Grief, Joy, Love, Nervousness, Optimism, Pride, Realization, Relief, Remorse, Sadness, Surprise, Neutral.*

## ⚠️ Important Notice
**This is a supportive tool, not a replacement for professional mental health care.**
If you are in crisis, the chatbot is designed to provide emergency resources immediately.

## 🤝 Contributing
This project was created for a hackathon. Contributions are welcome!
