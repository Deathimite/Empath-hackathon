import os

content = """# Empath.ai Backend Configuration

# Flask
SECRET_KEY=empath-ai-secret-key-change-in-production
FLASK_DEBUG=0

# CORS
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Server
HOST=0.0.0.0
PORT=5001

# OpenAI API
OPENAI_API_KEY=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
"""

with open('.env', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed .env file encoding.")
