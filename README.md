# empath.ai — Mental Health AI Chatbot

empath.ai is a modern mental health and well-being web application built using React, TypeScript, and Framer Motion.  
It combines an AI-powered chat interface with practical coping tools like mood tracking, breathing exercises, journaling, meditation, and more — all wrapped in smooth animations and a calm, accessible UI.

This app is meant to support, not diagnose or magically fix your life. If an app claims that, it’s lying.

---

## Features

### Authentication
- Login system using a custom AuthManager
- Unauthenticated users are blocked from accessing the chatbot
- Logout functionality available via Settings

### AI Chat
- User ↔ Bot messaging
- Message timestamps
- Optional detected mood metadata:
  - Emotion
  - Confidence level (high / medium / low)
- Central hub to navigate to recommended coping activities

### Mood Dashboard
- Tracks mood history with:
  - Date
  - Mood label
  - Numeric value
  - Optional notes
- Helps visualize emotional trends over time

### Wellness and Coping Activities
Users can access multiple guided tools:
- Breathing exercises (e.g., 4-7-8 breathing)
- Journaling
- Meditation
- Calming sounds
- Gratitude practice
- Mindful breaks
- Eating habits reflection
- Sleep habits reflection

Each activity ends with a completion screen to acknowledge progress.

### Settings and Privacy
- Accessibility preferences initialized using SystemPreferencesManager
- Dedicated privacy information screen
- Logout support

### Animations
- Screen transitions handled using Framer Motion
- AnimatePresence ensures smooth enter and exit animations
- Clean, non-disruptive UI transitions

---

## Tech Stack

- React (Functional Components and Hooks)
- TypeScript
- Framer Motion
- Tailwind CSS
- Custom utilities:
  - AuthManager
  - SystemPreferencesManager

---

## App Flow

1. User lands on the Login Screen
2. Successful login leads to Onboarding
3. Main interaction occurs in Chat
4. AI suggests coping activities
5. User completes activities and reaches the Completion Screen
6. Mood insights are available in the Dashboard
7. Settings and Privacy remain accessible at all times

---

## Project Structure

- src/
  - components/
    - ChatScreen.tsx  
      - AI chatbot interface  
      - Message handling and navigation to activities  

    - OnboardingScreen.tsx  
      - Initial welcome and app introduction  

    - MoodDashboard.tsx  
      - Displays mood history  
      - Visualizes emotional trends  

    - CopingStrategies.tsx  
      - Lists available coping and wellness activities  

    - BreathingExercise.tsx  
      - Guided breathing exercises  
      - Triggers completion flow  

    - CompletionScreen.tsx  
      - Shown after finishing an activity  
      - Reinforces progress  

    - JournalingScreen.tsx  
      - Guided journaling interface  

    - MeditationScreen.tsx  
      - Meditation guidance and sessions  

    - CalmingSoundsScreen.tsx  
      - Ambient and calming audio options  

    - GratitudePracticeScreen.tsx  
      - Gratitude reflection prompts  

    - MindfulBreakScreen.tsx  
      - Short mindfulness and break activities  

    - EatingHabitsScreen.tsx  
      - Eating habit reflection and awareness  

    - SleepHabitsScreen.tsx  
      - Sleep habit tracking and guidance  

    - PrivacyInfoScreen.tsx  
      - Displays privacy-related information  

    - SettingsScreen.tsx  
      - App settings  
      - Logout functionality  

  - lib/
    - authManager.ts  
      - Handles authentication logic  
      - Determines user access state  

    - systemPreferences.ts  
      - Initializes accessibility preferences  
      - Manages system-level UI settings  

  - App.tsx  
    - Main application entry point  
    - Screen routing and global state management





