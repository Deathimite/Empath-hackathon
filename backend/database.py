import sqlite3
from datetime import datetime
import os
import bcrypt

class Database:
    def __init__(self, db_path='empath.db'):
        """Initialize database connection and create tables if they don't exist."""
        self.db_path = db_path
        self.init_db()
    
    def get_connection(self):
        """Get a database connection."""
        return sqlite3.connect(self.db_path)
    
    def init_db(self):
        """Create database tables if they don't exist."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                username TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Conversations table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                sender TEXT NOT NULL,
                emotion TEXT,
                confidence REAL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        
        # Mood tracking table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS mood_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                emotion TEXT NOT NULL,
                intensity INTEGER,
                note TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        
        # User preferences table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_preferences (
                user_id INTEGER PRIMARY KEY,
                notification_enabled BOOLEAN DEFAULT 1,
                theme TEXT DEFAULT 'light',
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def register_user(self, email, username, password):
        """Register a new user with hashed password."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Hash the password
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            
            cursor.execute(
                'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
                (email, username, password_hash)
            )
            user_id = cursor.lastrowid
            conn.commit()
            conn.close()
            return user_id
        except sqlite3.IntegrityError:
            conn.close()
            return None  # User already exists
    
    def authenticate_user(self, email, password):
        """Authenticate a user and return user data if successful."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'SELECT id, email, username, password_hash FROM users WHERE email = ?',
            (email,)
        )
        user = cursor.fetchone()
        conn.close()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user[3]):
            # Update last active
            self._update_last_active(user[0])
            return {
                'id': user[0],
                'email': user[1],
                'username': user[2]
            }
        return None
    
    def get_user_by_email(self, email):
        """Get user by email."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'SELECT id, email, username FROM users WHERE email = ?',
            (email,)
        )
        user = cursor.fetchone()
        conn.close()
        
        if user:
            return {
                'id': user[0],
                'email': user[1],
                'username': user[2]
            }
        return None
    
    def get_user_by_id(self, user_id):
        """Get user by ID."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'SELECT id, email, username FROM users WHERE id = ?',
            (user_id,)
        )
        user = cursor.fetchone()
        conn.close()
        
        if user:
            return {
                'id': user[0],
                'email': user[1],
                'username': user[2]
            }
        return None
    
    def _update_last_active(self, user_id):
        """Update user's last active timestamp."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?',
            (user_id,)
        )
        conn.commit()
        conn.close()
    
    def create_user(self, username):
        """Legacy method - kept for backward compatibility during migration."""
        # This is now deprecated, but kept to avoid breaking existing code
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # For legacy anonymous users, create with dummy email
            email = f"{username}@legacy.local"
            password_hash = bcrypt.hashpw(b'legacy', bcrypt.gensalt())
            cursor.execute(
                'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
                (email, username, password_hash)
            )
            user_id = cursor.lastrowid
            conn.commit()
        except sqlite3.IntegrityError:
            # User already exists
            cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
            result = cursor.fetchone()
            if result:
                user_id = result[0]
                # Update last active
                cursor.execute('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?', (user_id,))
                conn.commit()
            else:
                conn.close()
                return None
        
        conn.close()
        return user_id
    
    def save_conversation(self, user_id, message, sender, emotion=None, confidence=None):
        """Save a conversation message."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO conversations (user_id, message, sender, emotion, confidence)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, message, sender, emotion, confidence))
        
        conn.commit()
        message_id = cursor.lastrowid
        conn.close()
        return message_id
    
    def get_conversation_history(self, user_id, limit=50):
        """Get conversation history for a user."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT message, sender, emotion, confidence, timestamp
            FROM conversations
            WHERE user_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (user_id, limit))
        
        conversations = cursor.fetchall()
        conn.close()
        
        return [
            {
                'message': conv[0],
                'sender': conv[1],
                'emotion': conv[2],
                'confidence': conv[3],
                'timestamp': conv[4]
            }
            for conv in conversations
        ]
    
    def save_mood_entry(self, user_id, emotion, intensity, note=None):
        """Save a mood tracking entry."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO mood_entries (user_id, emotion, intensity, note)
            VALUES (?, ?, ?, ?)
        ''', (user_id, emotion, intensity, note))
        
        conn.commit()
        entry_id = cursor.lastrowid
        conn.close()
        return entry_id
    
    def get_mood_history(self, user_id, days=7):
        """Get mood history for a user."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT emotion, intensity, note, timestamp
            FROM mood_entries
            WHERE user_id = ?
            AND timestamp >= datetime('now', '-' || ? || ' days')
            ORDER BY timestamp DESC
        ''', (user_id, days))
        
        moods = cursor.fetchall()
        conn.close()
        
        return [
            {
                'emotion': mood[0],
                'intensity': mood[1],
                'note': mood[2],
                'timestamp': mood[3]
            }
            for mood in moods
        ]
    
    def get_user_stats(self, user_id):
        """Get statistics for a user."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Total conversations
        cursor.execute('SELECT COUNT(*) FROM conversations WHERE user_id = ?', (user_id,))
        total_conversations = cursor.fetchone()[0]
        
        # Most common emotion
        cursor.execute('''
            SELECT emotion, COUNT(*) as count
            FROM conversations
            WHERE user_id = ? AND emotion IS NOT NULL
            GROUP BY emotion
            ORDER BY count DESC
            LIMIT 1
        ''', (user_id,))
        
        most_common = cursor.fetchone()
        most_common_emotion = most_common[0] if most_common else None
        
        # Days active
        cursor.execute('''
            SELECT COUNT(DISTINCT DATE(timestamp))
            FROM conversations
            WHERE user_id = ?
        ''', (user_id,))
        days_active = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            'total_conversations': total_conversations,
            'most_common_emotion': most_common_emotion,
            'days_active': days_active
        }

# Singleton instance
_database = None

def get_database():
    """Get or create the database instance."""
    global _database
    if _database is None:
        db_path = os.getenv('DATABASE_PATH', 'empath.db')
        _database = Database(db_path)
    return _database
