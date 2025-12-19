import { useState, useRef, useEffect } from 'react';
import { Send, Moon, Clock, Bed, Sunrise } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const SLEEP_PROMPTS = [
    "What time do you usually go to bed?",
    "What time do you typically wake up?",
    "How would you rate your sleep quality lately?",
    "Do you have trouble falling asleep or staying asleep?",
    "What does your bedtime routine look like?",
    "Do you use screens (phone, TV) before bed?",
    "How do you feel when you wake up?",
    "Are there any recurring thoughts that keep you awake?",
];

const SLEEP_RESPONSES: Record<string, string[]> = {
    bedtime: [
        "I see! Consistency in bedtime is key. Our bodies thrive on routine. Going to bed at the same time each night helps regulate your circadian rhythm.",
        "That's helpful to know. For optimal rest, try to aim for 7-9 hours of sleep. Would you like tips on creating a better bedtime routine?",
    ],
    wakeup: [
        "Morning routines matter! Waking up at a consistent time helps stabilize your internal clock, even on weekends.",
        "Natural light in the morning can help you feel more alert. Try to get some sunlight within 30 minutes of waking.",
    ],
    quality: [
        "Sleep quality is just as important as quantity. Let's explore what might be affecting your rest.",
        "I understand. Poor sleep quality can impact everything from mood to focus. Let's work on improving that together.",
    ],
    default: [
        "Thank you for sharing that. Understanding your sleep patterns helps me give better recommendations.",
        "That's really helpful information. Sleep is so interconnected with mental health - we're on the right track.",
        "I appreciate your openness. Small adjustments to sleep habits can make a big difference over time.",
    ],
};

export function SleepWellness() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm here to help you develop better sleep habits. Quality sleep is essential for mental and physical health. Let's start by understanding your current sleep patterns. What time do you usually go to bed?",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const quickActions = [
        { icon: Clock, text: 'Discuss sleep schedule' },
        { icon: Bed, text: 'Talk about sleep quality' },
        { icon: Sunrise, text: 'Morning routine tips' },
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const getAIResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('bed') || lowerMessage.includes('night') || lowerMessage.includes('sleep') || lowerMessage.includes('pm')) {
            return SLEEP_RESPONSES.bedtime[Math.floor(Math.random() * SLEEP_RESPONSES.bedtime.length)];
        }
        if (lowerMessage.includes('wake') || lowerMessage.includes('morning') || lowerMessage.includes('am') || lowerMessage.includes('alarm')) {
            return SLEEP_RESPONSES.wakeup[Math.floor(Math.random() * SLEEP_RESPONSES.wakeup.length)];
        }
        if (lowerMessage.includes('quality') || lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('restless')) {
            return SLEEP_RESPONSES.quality[Math.floor(Math.random() * SLEEP_RESPONSES.quality.length)];
        }

        const followUp = currentPromptIndex < SLEEP_PROMPTS.length - 1
            ? `\n\n${SLEEP_PROMPTS[currentPromptIndex + 1]}`
            : "\n\nBased on what you've shared, I can help create a personalized sleep improvement plan. Would you like that?";

        setCurrentPromptIndex(prev => Math.min(prev + 1, SLEEP_PROMPTS.length - 1));

        return SLEEP_RESPONSES.default[Math.floor(Math.random() * SLEEP_RESPONSES.default.length)] + followUp;
    };

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: text.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponse = getAIResponse(text);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-lg">
                        <Moon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Sleep Wellness</h2>
                        <p className="text-gray-600 text-sm">Improve your rest for better mental health</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">Personalized</Badge>
                    <Badge variant="outline">Interactive</Badge>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <Card className="border-0 shadow-sm bg-indigo-50">
                    <CardHeader className="pb-2 pt-3 px-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            Sleep Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pb-3">
                        <p className="text-xs text-gray-600">Consistency helps your body's internal clock</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-purple-50">
                    <CardHeader className="pb-2 pt-3 px-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Bed className="w-4 h-4 text-purple-600" />
                            Sleep Posture
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pb-3">
                        <p className="text-xs text-gray-600">Position matters for quality rest</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-blue-50">
                    <CardHeader className="pb-2 pt-3 px-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Sunrise className="w-4 h-4 text-blue-600" />
                            Morning Routine
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pb-3">
                        <p className="text-xs text-gray-600">Start your day right for better nights</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
                <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%]`}>
                                <div
                                    className={`rounded-2xl px-4 py-3 shadow-sm ${message.sender === 'user'
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-900 rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                                    <p
                                        className={`text-xs mt-2 ${message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'}`}
                                    >
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => sendMessage(action.text)}
                            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 transition-colors shadow-sm"
                        >
                            <action.icon className="w-4 h-4 text-indigo-500" />
                            {action.text}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 items-center bg-white rounded-xl shadow-md p-2 border border-gray-200">
                    <Input
                        type="text"
                        placeholder="Tell me about your sleep habits..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim()}
                        className={`rounded-lg px-4 py-2 ${input.trim()
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                            : 'bg-gray-300'
                            } text-white transition-all`}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
