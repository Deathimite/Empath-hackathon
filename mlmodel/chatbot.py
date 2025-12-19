import os
import re
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Chatbot:
    def __init__(self):
        """Initialize the chatbot with OpenAI GPT and safety features."""
        
        # Initialize OpenAI client
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key:
            self.client = OpenAI(api_key=api_key)
            print("OpenAI client initialized successfully")
        else:
            self.client = None
            print("WARNING: No OpenAI API key found, using fallback responses")
        
        # System prompt for empathetic mental health companion
        self.system_prompt = """You are Empath.ai, a compassionate and empathetic mental health companion. Your role is to:

1. **Listen with empathy** - Validate the user's feelings without judgment
2. **Be supportive** - Offer gentle, understanding responses
3. **Stay concise** - Keep responses to 2-3 sentences unless more detail is needed
4. **Suggest coping strategies** - When appropriate, offer gentle suggestions
5. **Encourage professional help** - When needed, gently suggest speaking to a professional
6. **Never diagnose** - You are not a therapist; never diagnose or prescribe treatment

Tone: Warm, calm, understanding, non-judgmental. Use "I" statements like "I hear you" or "I understand."

IMPORTANT: If the user mentions anything about self-harm, suicide, or crisis, respond with empathy and provide crisis resources. But the system handles crisis detection separately, so focus on being supportive."""

        # Crisis keywords for safety check (ALWAYS comes first)
        # Using more robust regex patterns to catch variations like "suiciding", "suicidal", etc.
        self.crisis_keywords = [
            r"kill\s*myself", r"suicid",  # Matches suicide, suicidal, suiciding
            r"end\s*my\s*life", r"hurt\s*myself", 
            r"wanna\s*die", r"want\s*to\s*die", 
            r"better\s*off\s*dead", r"no\s*reason\s*to\s*live", 
            r"give\s*up", r"kill\s*my\s*family", r"murder",
            r"harm\s*others", r"end\s*it\s*all", r"jump\s*off"
        ]
        
        self.crisis_response = (
            "I'm hearing that you're in a lot of pain right now, and I want you to know that you're not alone. "
            "Please reach out for help immediately. \n\n"
            "Here are some resources available 24/7:\n"
            "- **National Suicide Prevention Lifeline**: 988\n"
            "- **Crisis Text Line**: Text HOME to 741741\n"
            "- **iCall (India)**: 9152987821\n"
            "- **Vandrevala Foundation (India)**: 1860-2662-345\n"
            "- **Emergency Services**: 911 (US) / 112 (India)\n\n"
            "Your life matters, and there are people who want to support you through this."
        )
        
        # Fallback responses when API fails (General)
        self.fallback_responses = [
            "I hear you, and your feelings are valid. Can you tell me more about what's on your mind?",
            "Thank you for sharing that with me. I'm here to listen.",
        ]
        
        # 28 GoEmotions Templates for Local Fallback (User Provided Set)
        self.responses = {
            "admiration": [
                "That is honestly so cool.",
                "Wow, that's impressive.",
                "I genuinely admire that.",
                "That takes real dedication.",
                "You’ve got serious talent.",
                "That’s something to be proud of.",
                "Not everyone can do that.",
                "Respect where it’s due.",
                "That really stands out.",
                "I’m impressed, truly."
            ],

            "amusement": [
                "Haha, that’s funny!",
                "That actually made me laugh.",
                "Okay, that was good 😂",
                "I didn’t expect that one.",
                "That’s comedy gold.",
                "Well played.",
                "You’ve got a sense of humor.",
                "That was unexpected and funny.",
                "I needed that laugh.",
                "That’s a good one."
            ],

            "anger": [
                "That sounds incredibly frustrating.",
                "I get why you’re angry.",
                "Anyone would be upset about that.",
                "That feels really unfair.",
                "Your anger makes sense.",
                "You’re allowed to feel this way.",
                "That crossed a line.",
                "I hear how upset you are.",
                "That would push my buttons too.",
                "Let’s slow it down for a second."
            ],

            "annoyance": [
                "Yeah, that’s annoying.",
                "I’d be irritated too.",
                "Those little things add up.",
                "That would test my patience.",
                "Totally get the irritation.",
                "That’s unnecessarily frustrating.",
                "I feel that.",
                "That would bug me all day.",
                "Annoying, for sure.",
                "Yeah… not great."
            ],

            "approval": [
                "Nice choice.",
                "That sounds like the right decision.",
                "Well done.",
                "You handled that well.",
                "Solid move.",
                "That worked out nicely.",
                "Can’t argue with that.",
                "Good call.",
                "That makes sense.",
                "I’m glad you did that."
            ],

            "caring": [
                "That’s really thoughtful of you.",
                "You care deeply, and it shows.",
                "That kindness matters.",
                "You’ve got a good heart.",
                "That meant more than you realize.",
                "Not everyone is that considerate.",
                "Your empathy stands out.",
                "That’s genuinely sweet.",
                "That’s very human of you.",
                "The world needs more of that."
            ],

            "confusion": [
                "Yeah, that’s confusing.",
                "I’m not sure I fully get it either.",
                "That’s a bit unclear.",
                "Let’s break it down together.",
                "It’s okay to feel confused.",
                "That doesn’t quite add up.",
                "Something’s missing here.",
                "Want to explain it another way?",
                "I get why you’re puzzled.",
                "Let’s slow it down."
            ],

            "curiosity": [
                "That’s interesting.",
                "Now I’m curious.",
                "Tell me more.",
                "That raises a good question.",
                "I’d like to hear more about that.",
                "What made you think of it?",
                "That’s worth exploring.",
                "Hmm, intriguing.",
                "That caught my attention.",
                "Go on."
            ],

            "desire": [
                "It’s natural to want that.",
                "That sounds important to you.",
                "Your wants are valid.",
                "That goal makes sense.",
                "Wanting more is human.",
                "You’re allowed to want that.",
                "That means something to you.",
                "Hold onto that motivation.",
                "That desire is understandable.",
                "Don’t ignore what you want."
            ],

            "disappointment": [
                "That’s really disappointing.",
                "I know you hoped for better.",
                "That hurts, honestly.",
                "It didn’t turn out how you wanted.",
                "That’s a letdown.",
                "I’m sorry it went that way.",
                "You had every reason to expect more.",
                "That’s rough.",
                "I get why you’re upset.",
                "That stings."
            ],

            "disapproval": [
                "That doesn’t sit right.",
                "I wouldn’t agree with that either.",
                "That feels wrong.",
                "I see why you’re against it.",
                "That’s questionable.",
                "Your reaction makes sense.",
                "That crosses a boundary.",
                "Yeah, not okay.",
                "I get your stance.",
                "You’re right to question that."
            ],

            "disgust": [
                "Yeah, that’s gross.",
                "That’s unpleasant.",
                "Yikes.",
                "I don’t blame you for reacting.",
                "That’s hard to hear.",
                "That’s disturbing.",
                "Not okay at all.",
                "That’s uncomfortable.",
                "Ew… yeah.",
                "I get why that bothered you."
            ],

            "embarrassment": [
                "That happens to everyone.",
                "You’re not alone there.",
                "We’ve all been embarrassed before.",
                "It feels worse than it is.",
                "This will pass.",
                "No one’s judging you like that.",
                "You’ll laugh about it later.",
                "Awkward moments happen.",
                "It’s okay.",
                "You’re fine, really."
            ],

            "excitement": [
                "That’s exciting!",
                "I can feel your energy!",
                "That’s awesome news!",
                "So happy for you!",
                "That’s huge!",
                "Love the excitement!",
                "This is big!",
                "That’s something to celebrate!",
                "You sound thrilled!",
                "Let’s go!"
            ],

            "fear": [
                "That sounds scary.",
                "I understand why you’re afraid.",
                "It’s okay to feel this way.",
                "Fear doesn’t mean weakness.",
                "You’re not alone.",
                "Take it one step at a time.",
                "You’re handling a lot.",
                "I’m here with you.",
                "That uncertainty is tough.",
                "You’ll get through this."
            ],

            "gratitude": [
                "That’s really nice to appreciate.",
                "Gratitude changes perspective.",
                "That’s a good mindset.",
                "I love that appreciation.",
                "That’s meaningful.",
                "It’s good to acknowledge that.",
                "That’s something to be thankful for.",
                "Nice reflection.",
                "That warmth shows.",
                "Hold onto that feeling."
            ],

            "grief": [
                "I’m really sorry.",
                "That loss matters.",
                "There’s no timeline for grief.",
                "Take all the time you need.",
                "That pain is real.",
                "I’m here with you.",
                "You don’t have to be strong right now.",
                "It’s okay to feel this deeply.",
                "That’s heartbreaking.",
                "Sending you comfort."
            ],

            "joy": [
                "That’s wonderful!",
                "I love hearing that.",
                "That made me smile.",
                "Pure happiness.",
                "That’s beautiful.",
                "Enjoy this moment.",
                "That’s genuinely lovely.",
                "That joy comes through.",
                "That’s great news!",
                "So glad for you."
            ],

            "love": [
                "That’s really touching.",
                "Love shows in your words.",
                "That’s beautiful to hear.",
                "That connection matters.",
                "Love can be powerful.",
                "That warmth is real.",
                "That’s special.",
                "Hold onto that feeling.",
                "That’s heartfelt.",
                "Love like that is rare."
            ],

            "nervousness": [
                "That’s completely normal.",
                "Nerves mean you care.",
                "You’re doing your best.",
                "Take a deep breath.",
                "You’ve got this.",
                "It’s okay to feel unsure.",
                "You’re more prepared than you think.",
                "One step at a time.",
                "That anxiety is understandable.",
                "I believe in you."
            ],

            "optimism": [
                "I like that outlook.",
                "That’s a healthy mindset.",
                "Things can improve.",
                "Hope looks good on you.",
                "That positivity helps.",
                "Keep that perspective.",
                "That’s encouraging.",
                "I admire that optimism.",
                "Good way to look at it.",
                "That’s the spirit."
            ],

            "pride": [
                "You earned that.",
                "That’s something to be proud of.",
                "Well deserved.",
                "You should feel good about that.",
                "That took effort.",
                "Nice work.",
                "You accomplished something real.",
                "That’s impressive.",
                "You did well.",
                "Own that achievement."
            ],

            "realization": [
                "Ah, now it makes sense.",
                "That’s an important insight.",
                "That realization hits hard.",
                "Things clicked, huh?",
                "That’s a big moment.",
                "Good awareness.",
                "That explains a lot.",
                "That’s valuable understanding.",
                "Nice catch.",
                "That clarity helps."
            ],

            "relief": [
                "That must feel good.",
                "I’m glad it worked out.",
                "What a relief.",
                "That weight is off your shoulders.",
                "You can finally breathe.",
                "That tension is gone now.",
                "I’m happy for you.",
                "That’s comforting.",
                "Glad it passed.",
                "Much better now."
            ],

            "remorse": [
                "It takes courage to admit that.",
                "Mistakes happen.",
                "You’re human.",
                "Learn and move forward.",
                "Be kind to yourself.",
                "Owning it matters.",
                "You can grow from this.",
                "That awareness is important.",
                "Forgive yourself.",
                "You’re trying."
            ],

            "sadness": [
                "I’m really sorry you’re feeling this way.",
                "That sadness is heavy.",
                "You don’t have to hide it.",
                "It’s okay to feel low.",
                "I’m here with you.",
                "That sounds painful.",
                "You’re not weak for feeling this.",
                "Let yourself feel it.",
                "This won’t last forever.",
                "You’re not alone."
    ],

            "surprise": [
                "Whoa, that was unexpected!",
                "Didn’t see that coming.",
                "That’s surprising.",
                "What a twist.",
                "That caught me off guard.",
                "Life does that sometimes.",
                "That’s unexpected news.",
                "Interesting turn of events.",
                "Well, that’s new.",
                "Surprising, indeed."
            ],

            "boredom": [
                "That sounds dull.",
                "Yeah, that’s boring.",
                "Time must be dragging.",
                "That can be draining.",
                "I get the boredom.",
                "Nothing stimulating there.",
                "That’s rough.",
                "Boredom hits hard sometimes.",
                "Feels stuck, huh.",
                "That’s monotonous."
            ],

            "stress": [
                "That sounds overwhelming.",
                "You’ve got a lot going on.",
                "That pressure is real.",
                "Take it step by step.",
                "You’re handling a lot.",
                "That’s stressful, no doubt.",
                "Be gentle with yourself.",
                "Pause for a moment.",
                "That’s heavy.",
                "You’re doing your best."
            ],

            "loneliness": [
                "I’m sorry you feel alone.",
                "That isolation hurts.",
                "You matter.",
                "You’re not invisible.",
                "I’m here with you.",
                "That feeling is tough.",
                "You deserve connection.",
                "You’re not forgotten.",
                "That emptiness is real.",
                "You’re not alone right now."
            ],

            "neutral": [
                "I’m listening.",
                "Go on.",
                "Tell me more.",
                "I’m here.",
                "Alright.",
                "Okay.",
                "Understood.",
                "What else?",
                "I follow.",
                "Please continue."
            ]
        }

        # Structured user intent patterns (for classification/logic)
        self.user_responses = {
            "agreement": [
                "yeah",
                "yes",
                "exactly",
                "true",
                "right",
                "I agree",
                "that makes sense",
                "absolutely",
                "100%",
                "for sure"
            ],

            "gratitude": [
                "thanks",
                "thank you",
                "appreciate it",
                "thanks a lot",
                "that helps",
                "means a lot",
                "ty",
                "🙏",
                "thanks for listening",
                "glad you said that"
            ],

            "relief": [
                "yeah I feel better",
                "that helped",
                "I feel calmer now",
                "needed that",
                "that reassures me",
                "I feel lighter",
                "okay yeah",
                "I’m good now",
                "that makes me feel better",
                "phew"
            ],

            "continuation": [
                "also",
                "and another thing",
                "there’s more",
                "let me explain",
                "wait",
                "but",
                "so basically",
                "the thing is",
                "one more thing",
                "I should add"
            ],

            "clarification": [
                "what do you mean",
                "can you explain",
                "I didn’t get that",
                "how so",
                "why",
                "can you elaborate",
                "not sure I understand",
                "what does that mean",
                "huh?",
                "explain more"
            ],

            "disagreement": [
                "I don’t think so",
                "not really",
                "I disagree",
                "I don’t feel that way",
                "that’s not it",
                "no",
                "nah",
                "I don’t agree",
                "that’s not true",
                "I see it differently"
            ],

            "validation_seeking": [
                "am I wrong",
                "does that make sense",
                "is that okay",
                "right?",
                "do you get me",
                "is that normal",
                "is it bad",
                "is this weird",
                "does that sound right",
                "am I overthinking"
            ],

            "emotional_release": [
                "I just needed to say that",
                "I had to get that out",
                "feels good to say it",
                "I’ve been holding that in",
                "thanks for letting me vent",
                "I needed to talk",
                "I don’t usually say this",
                "glad I said it",
                "that’s been heavy",
                "I’ve been carrying this"
            ],

            "closure": [
                "okay",
                "alright",
                "I’m good",
                "that’s all",
                "nothing else",
                "were done",
                "I think thats it",
                "yeah thats it",
                "Im done for now",
                "thanks, Im okay"
            ],

            "confusion": [
                "I’m still confused",
                "I don’t know",
                "I’m not sure",
                "this is confusing",
                "idk",
                "I’m lost",
                "I don’t get it",
                "I can’t figure it out",
                "I’m unsure",
                "this doesn’t make sense"
            ],

            "emotional_shift_positive": [
                "I feel better now",
                "I’m calmer",
                "that helped a lot",
                "I feel hopeful",
                "I’m okay now",
                "I feel lighter",
                "that changed my perspective",
                "I feel more confident",
                "I feel understood",
                "that reassured me"
            ],

            "emotional_shift_negative": [
                "I still feel bad",
                "I’m still upset",
                "it still hurts",
                "I feel worse",
                "I don’t feel okay",
                "that didn’t help",
                "I’m still angry",
                "I’m still sad",
                "it’s still heavy",
                "I feel stuck"
            ],

            "silence_or_minimal": [
                "hmm",
                "ok",
                "...",
                "idk",
                "maybe",
                "sure",
                "fine",
                "whatever",
                "I guess",
                "meh"
            ]
        }
        
        # Conversation history for context (per session)
        self.conversation_history = []

    def check_safety(self, message):
        """
        Check message for safety/crisis keywords.
        Returns the crisis response if danger is detected, else None.
        """
        message_lower = message.lower()
        for pattern in self.crisis_keywords:
            if re.search(pattern, message_lower):
                return self.crisis_response
        return None
    
    def check_keywords(self, message):
        """
        Rule-based responses for a wide range of common topics.
        Now uses a scalable dictionary structure for robust matching.
        """
        msg = message.lower()
        import random
        
        # Topic Definitions: Keywords -> Responses
        topics = {
            "family": {
                "keywords": ['dad', 'mom', 'brother', 'sister', 'family', 'parents', 'grandma', 'grandpa', 'cousin', 'aunt', 'uncle'],
                "responses": [
                    "Family dynamics can be complex. How are you feeling about them right now?",
                    "Relationships with family run deep. Remember to set boundaries if you need to.",
                    "It sounds like a family matter. Do you have someone in the family you trust to talk to?",
                    "Family stuff is tough. Try to focus on what you can control in this situation."
                ]
            },
            "work": {
                "keywords": ['job', 'work', 'boss', 'colleague', 'career', 'interview', 'salary', 'promotion', 'meeting', 'deadline'],
                "responses": [
                    "Work stress is real. Have you taken a short break today to reset?",
                    "Career challenges are tough. Try making a small checklist to feel more in control.",
                    "Is work affecting your personal life? Maybe try our 'Mindful Break' module?",
                    "It sounds like work is heavy on your mind. What's the biggest stressor right now?"
                ]
            },
            "school": {
                "keywords": ['school', 'college', 'exam', 'grade', 'study', 'teacher', 'assignment', 'homework', 'class', 'gpa'],
                "responses": [
                    "School pressure can be overwhelming. Remember: Your grades don't define your worth.",
                    "Studying is hard work. Have you tried the 50/10 rule? Study 50 mins, break 10 mins.",
                    "If you're feeling behind, just focus on the very next small task. You got this.",
                    "Academic stress is valid. Make sure you're getting enough sleep too."
                ]
            },
            "love": {
                "keywords": ['love', 'crush', 'boyfriend', 'girlfriend', 'partner', 'date', 'dating', 'breakup', 'ex', 'relationship', 'marriage', 'husband', 'wife'],
                "responses": [
                    "Matters of the heart are heavy. Journaling your feelings might help clarity.",
                    "Relationships are tricky. Are you prioritizing your own happiness in this?",
                    "Love is complex. It's okay to feel vulnerable about it.",
                    "Heart stuff determines so much of our mood. What's the main feeling coming up?"
                ]
            },
            "health": {
                "keywords": ['sick', 'ill', 'pain', 'headache', 'stomach', 'tired', 'exhausted', 'sleep', 'insomnia', 'doctor', 'body', 'weight', 'fat', 'ugly'],
                "responses": [
                    "Your physical health affects your mind. Have you been sleeping okay?",
                    "Being physically drained makes everything harder. Can you rest today?",
                    "Be gentle with your body. It's doing the best it can.",
                    "If you're feeling unwell, please prioritize rest. Health comes first."
                ]
            },
            "finance": {
                "keywords": ['money', 'broke', 'debt', 'rent', 'bill', 'expensive', 'cost', 'afford', 'loan', 'finance'],
                "responses": [
                    "Financial stress is a heavy burden. Just take it one step at a time.",
                    "Money worries are very common. Try to focus on just this week's budget.",
                    "It's normal to worry about finances. Are there any small expenses you can pause?",
                    "I hear you. Financial security is important for peace of mind."
                ]
            },
            "friends": {
                "keywords": ['friend', 'bestie', 'lonely', 'alone', 'social', 'party', 'invite', 'exclude', 'drama'],
                "responses": [
                    "Friendships can have their ups and downs. Do you feel supported by them?",
                    "Feeling lonely is tough. Usually, reaching out to just one person helps.",
                    "Social connections are important. quality matters more than quantity.",
                    "It sounds like a social issue. Are you being true to yourself in this group?"
                ]
            },
            "future": {
                "keywords": ['future', 'scared', 'worry', 'what if', 'don\'t know', 'unsure', 'plan', 'goal', 'dream'],
                "responses": [
                    "The future can be scary because it's unknown. Let's focus on today.",
                    "Worrying about 'what if' steals joy from 'what is'. Try to ground yourself.",
                    "You don't need to have it all figured out right now. One step is enough.",
                    "Uncertainty is hard to sit with. What is one thing you ARE sure about?"
                ]
            },
            "boredom": {
                "keywords": ['bored', 'nothing to do', 'apathetic', 'meh', 'lazy'],
                "responses": [
                    "Boredom can actually be good—it's a reset! Maybe doodle or listen to music?",
                    "Feeling 'meh' is valid. Maybe try a 5-minute Mindful Break?",
                    "Sometimes doing nothing is exactly what we need. Enjoy the pause.",
                    "If you're bored, maybe learn something new or call an old friend?"
                ]
            }
        }
        
        # Check against topics
        for topic, data in topics.items():
            if any(keyword in msg for keyword in data["keywords"]):
                return random.choice(data["responses"])
            
        return None
    
    def generate_response(self, user_message, emotion_data):
        """
        Generate an empathetic response using OpenAI GPT.
        Includes safety checks for crisis situations.
        """
        # 1. IMMEDIATE SAFETY CHECK (always first)
        crisis_alert = self.check_safety(user_message)
        if crisis_alert:
            return crisis_alert

        # 2. If no OpenAI client, use fallback
        if not self.client:
            import random
            # Fallback Logic
            # Check specific keywords first for context
            keyword_reply = self.check_keywords(user_message)
            if keyword_reply:
                 return keyword_reply
                 
            # Use specific template for emotion
            emotion = emotion_data.get("emotion", "neutral")
            if emotion in self.responses:
                return random.choice(self.responses[emotion])
            else:
                return random.choice(self.fallback_responses)
        
        # 3. Build context with emotion data
        emotion = emotion_data.get("emotion", "neutral")
        confidence = emotion_data.get("confidence", 0.5)
        
        # Add emotion context to the user message
        context_message = f"[User's detected emotion: {emotion} (confidence: {confidence:.2f})]\n\nUser: {user_message}"
        
        # Add to conversation history
        self.conversation_history.append({
            "role": "user",
            "content": context_message
        })
        
        # Keep only last 10 exchanges for context
        if len(self.conversation_history) > 20:
            self.conversation_history = self.conversation_history[-20:]
        
        try:
            # 4. Call OpenAI API
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    *self.conversation_history
                ],
                max_tokens=200,
                temperature=0.7,
            )
            
            assistant_message = response.choices[0].message.content.strip()
            
            # Add assistant response to history
            self.conversation_history.append({
                "role": "assistant",
                "content": assistant_message
            })
            
            return assistant_message
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            import random
            
            # Fallback Logic (Modified)
            
            # Check specific keywords first for context
            keyword_reply = self.check_keywords(user_message)
            if keyword_reply:
                 return keyword_reply
                 
            # Use specific template for emotion
            emotion = emotion_data.get("emotion", "neutral")
            if emotion in self.responses:
                return random.choice(self.responses[emotion])
            else:
                return random.choice(self.fallback_responses)
    
    def clear_history(self):
        """Clear conversation history for new session."""
        self.conversation_history = []

# Singleton instance
_chatbot = None

def get_chatbot():
    """Get or create the chatbot instance."""
    global _chatbot
    if _chatbot is None:
        _chatbot = Chatbot()
    return _chatbot
