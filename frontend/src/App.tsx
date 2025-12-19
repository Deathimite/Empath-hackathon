import { useState, useEffect } from 'react';
import { authApi } from './api-int/auth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { Onboarding } from './pages/Onboarding';
import { ChatInterface } from './pages/ChatInterface';
import { MoodDashboard } from './pages/MoodDashboard';
import { CopingStrategies } from './pages/CopingStrategies';
import { EatingHabits } from './pages/EatingHabits';
import { SleepWellness } from './pages/SleepWellness';
import { Journaling } from './pages/Journaling';
import { Meditation } from './pages/Meditation';
import { CalmingSounds } from './pages/CalmingSounds';
import { GratitudePractice } from './pages/GratitudePractice';
import { MindfulBreak } from './pages/MindfulBreak';
import { Settings } from './pages/Settings';
import {
  MessageCircle, BarChart3, Sparkles, Menu, X, LogOut,
  UtensilsCrossed, Moon, BookOpen, Heart, Volume2, Smile, Coffee, Settings as SettingsIcon
} from 'lucide-react';

type Screen = 'login' | 'register' | 'terms' | 'onboarding' | 'chat' | 'dashboard' | 'strategies' | 'eating' | 'sleep' | 'journal' | 'meditation' | 'sounds' | 'gratitude' | 'break' | 'settings';

interface User {
  id: number;
  email: string;
  username: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [lastAuthScreen, setLastAuthScreen] = useState<Screen>('register');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Load settings from localStorage or use defaults
  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('empath_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    return {
      theme: 'light',
      fontSize: 'normal',
      reducedMotion: false,
      saveHistory: true,
      personalization: true,
      voiceEnabled: true
    };
  });

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('empath_settings', JSON.stringify(appSettings));

    // Also apply dark class to document element for better global styling
    if (appSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appSettings]);

  const updateAppSetting = (key: string, value: any) => {
    setAppSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const data = await authApi.checkStatus();
      clearTimeout(timeoutId);

      if (data.authenticated && data.user) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        setIsOnboarded(true); // Skip onboarding for returning users
        setCurrentScreen('chat');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // On error, just show login screen
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setCurrentScreen('onboarding');
  };

  const handleRegisterSuccess = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setCurrentScreen('onboarding');
  };

  const handleShowTerms = () => {
    if (currentScreen === 'register' || currentScreen === 'login') {
      setLastAuthScreen(currentScreen);
    }
    setCurrentScreen('terms');
  };

  const handleTermsBack = () => {
    setCurrentScreen(lastAuthScreen);
  };

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    setCurrentScreen('chat');
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();

      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsOnboarded(false);
      setCurrentScreen('login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
    setMenuOpen(false);
  };

  const getFontSizePx = () => {
    switch (appSettings.fontSize) {
      case 'small': return '14px';
      case 'large': return '18px';
      default: return '16px';
    }
  };

  // Loading state
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Terms and Conditions
  if (currentScreen === 'terms') {
    return <TermsAndConditions onBack={handleTermsBack} />;
  }

  // Show login/register screens
  if (!isAuthenticated) {
    if (currentScreen === 'register') {
      return (
        <Register
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setCurrentScreen('login')}
          onShowTerms={handleShowTerms}
        />
      );
    }
    return <Login onSuccess={handleLoginSuccess} onSwitchToRegister={() => setCurrentScreen('register')} />;
  }

  // Show onboarding for new users
  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Main app
  return (
    <div
      className={`min-h-screen transition-all duration-500 font-sans ${appSettings.theme === 'dark'
        ? 'dark bg-gray-950 text-white'
        : 'bg-[#f8fafc] text-gray-900'
        } ${appSettings.reducedMotion ? 'reduced-motion' : ''}`}
      style={{ '--font-size': getFontSizePx() } as React.CSSProperties}
    >
      {/* Mobile Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg text-gray-900 dark:text-white">Empath.ai</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Welcome, {currentUser?.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="px-4 py-2 space-y-1">
              <button
                onClick={() => navigateTo('chat')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentScreen === 'chat'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => navigateTo('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentScreen === 'dashboard'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Mood Analytics</span>
              </button>
              <button
                onClick={() => navigateTo('strategies')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentScreen === 'strategies'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Coping Strategies</span>
              </button>
              <button
                onClick={() => navigateTo('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentScreen === 'settings'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <SettingsIcon className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      <div className="flex max-w-6xl mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 min-h-[calc(100vh-80px)] bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 p-6 sticky top-20">
          <nav className="space-y-1.5">
            <button
              onClick={() => navigateTo('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentScreen === 'chat'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
            >
              <MessageCircle className={`w-5 h-5 ${currentScreen === 'chat' ? 'text-white' : 'text-blue-500'}`} />
              <span className="font-medium">Chat Assistant</span>
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentScreen === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
            >
              <BarChart3 className={`w-5 h-5 ${currentScreen === 'dashboard' ? 'text-white' : 'text-indigo-500'}`} />
              <span className="font-medium">Mood Analytics</span>
            </button>
            <button
              onClick={() => navigateTo('strategies')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentScreen === 'strategies'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400'
                }`}
            >
              <Sparkles className={`w-5 h-5 ${currentScreen === 'strategies' ? 'text-white' : 'text-violet-500'}`} />
              <span className="font-medium">Coping Tools</span>
            </button>

            {/* Wellness Modules */}
            <div className="border-t border-gray-200 dark:border-gray-800 my-4 pt-4">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 px-4">Self Care</p>
            </div>
            <button
              onClick={() => navigateTo('eating')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${currentScreen === 'eating'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                }`}
            >
              <UtensilsCrossed className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium">Eating Habits</span>
            </button>
            <button
              onClick={() => navigateTo('sleep')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${currentScreen === 'sleep'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium">Sleep Wellness</span>
            </button>
            <button
              onClick={() => navigateTo('journal')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${currentScreen === 'journal'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">Journaling</span>
            </button>
            <button
              onClick={() => navigateTo('meditation')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${currentScreen === 'meditation'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-medium">Meditation</span>
            </button>
            <button
              onClick={() => navigateTo('sounds')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${currentScreen === 'sounds'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                }`}
            >
              <Volume2 className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-medium">Calming Sounds</span>
            </button>
            <button
              onClick={() => navigateTo('gratitude')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${currentScreen === 'gratitude'
                ? 'bg-yellow-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                }`}
            >
              <Smile className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Gratitude</span>
            </button>
            <button
              onClick={() => navigateTo('break')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${currentScreen === 'break'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                }`}
            >
              <Coffee className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">Mindful Break</span>
            </button>

            {/* Application Settings */}
            <div className="border-t border-gray-200 dark:border-gray-800 my-4 pt-4">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 px-4">System</p>
            </div>
            <button
              onClick={() => navigateTo('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentScreen === 'settings'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg ring-1 ring-gray-700/50'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <SettingsIcon className={`w-5 h-5 ${currentScreen === 'settings' ? (appSettings.theme === 'dark' ? 'text-gray-900' : 'text-white') : 'text-gray-500'}`} />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-h-[calc(100vh-80px)] p-4 md:p-8 lg:p-10 max-w-5xl">
          <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-800/20 shadow-2xl shadow-blue-500/5 min-h-full overflow-hidden">
            {currentScreen === 'chat' && <ChatInterface />}
            {currentScreen === 'dashboard' && <MoodDashboard />}
            {currentScreen === 'strategies' && <CopingStrategies />}
            {currentScreen === 'eating' && <EatingHabits />}
            {currentScreen === 'sleep' && <SleepWellness />}
            {currentScreen === 'journal' && <Journaling />}
            {currentScreen === 'meditation' && <Meditation />}
            {currentScreen === 'sounds' && <CalmingSounds />}
            {currentScreen === 'gratitude' && <GratitudePractice />}
            {currentScreen === 'break' && <MindfulBreak />}
            {currentScreen === 'settings' && (
              <Settings
                settings={appSettings}
                onUpdate={updateAppSetting}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
