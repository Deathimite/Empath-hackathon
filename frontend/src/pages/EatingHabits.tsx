import { useState, useRef, useEffect } from 'react';
import { Send, UtensilsCrossed, Clock, Apple, ChefHat } from 'lucide-react';
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

const EATING_PROMPTS = [
    "What time do you usually have breakfast?",
    "What does a typical lunch look like for you?",
    "When do you usually have dinner?",
    "Do you snack between meals? If so, what kind of snacks?",
    "How much water do you drink daily?",
    "Are there any foods you're trying to avoid or include more of?",
    "Do you have any dietary restrictions or preferences?",
    "How would you rate your current eating habits on a scale of 1-10?",
];

const EATING_RESPONSES: Record<string, string[]> = {
    breakfast: [
        "That's a good start! Breakfast timing matters. Eating within 1-2 hours of waking helps kickstart your metabolism.",
        "Based on what you've shared, I'd suggest including more protein in your breakfast to help you feel fuller longer.",
    ],
    lunch: [
        "Midday meals are crucial for sustained energy. Try to include a balance of complex carbs, lean protein, and vegetables.",
        "If you're eating lunch late, consider a small healthy snack around 10-11 AM to maintain energy levels.",
    ],
    dinner: [
        "For better sleep and digestion, try to have dinner at least 2-3 hours before bedtime.",
        "Evening meals should be lighter than lunch. Focus on vegetables and lean proteins.",
    ],
    default: [
        "Thank you for sharing! Let me note that down. What else can you tell me about your eating habits?",
        "That's helpful information. Shall we talk about meal timing or food choices next?",
        "I appreciate you being open about this. Small changes in eating habits can make a big difference over time.",
    ],
};

export function EatingHabits() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm here to help you develop healthier eating habits. Let's start by understanding your current routine. What time do you usually have your first meal of the day?",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const quickActions = [
        { icon: Clock, text: 'Discuss meal timing' },
        { icon: Apple, text: 'Talk about food choices' },
        { icon: ChefHat, text: 'Get meal suggestions' },
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const getAIResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('breakfast') || lowerMessage.includes('morning') || lowerMessage.includes('wake')) {
            return EATING_RESPONSES.breakfast[Math.floor(Math.random() * EATING_RESPONSES.breakfast.length)];
        }
        if (lowerMessage.includes('lunch') || lowerMessage.includes('noon') || lowerMessage.includes('midday')) {
            return EATING_RESPONSES.lunch[Math.floor(Math.random() * EATING_RESPONSES.lunch.length)];
        }
        if (lowerMessage.includes('dinner') || lowerMessage.includes('evening') || lowerMessage.includes('night')) {
            return EATING_RESPONSES.dinner[Math.floor(Math.random() * EATING_RESPONSES.dinner.length)];
        }

        // Follow-up with next prompt
        const followUp = currentPromptIndex < EATING_PROMPTS.length - 1
            ? `\n\n${EATING_PROMPTS[currentPromptIndex + 1]}`
            : "\n\nBased on what you've shared, I can help create a personalized meal schedule for you. Would you like me to do that?";

        setCurrentPromptIndex(prev => Math.min(prev + 1, EATING_PROMPTS.length - 1));

        return EATING_RESPONSES.default[Math.floor(Math.random() * EATING_RESPONSES.default.length)] + followUp;
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

        // Simulate AI thinking
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                        <UtensilsCrossed className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Eating Habits</h2>
                        <p className="text-gray-600 text-sm">Let's build a healthier relationship with food</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">Personalized</Badge>
                    <Badge variant="outline">Interactive</Badge>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <Card className="border-0 shadow-sm bg-orange-50">
                    <CardHeader className="pb-2 pt-3 px-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            Meal Timing
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pb-3">
                        <p className="text-xs text-gray-600">When you eat matters as much as what you eat</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-green-50">
                    <CardHeader className="pb-2 pt-3 px-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Apple className="w-4 h-4 text-green-600" />
                            Food Choices
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pb-3">
                        <p className="text-xs text-gray-600">Balance nutrients for sustained energy</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-blue-50">
                    <CardHeader className="pb-2 pt-3 px-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <ChefHat className="w-4 h-4 text-blue-600" />
                            Meal Planning
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pb-3">
                        <p className="text-xs text-gray-600">Get personalized recommendations</p>
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
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-none'
                                        : 'bg-white text-gray-900 rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                                    <p
                                        className={`text-xs mt-2 ${message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'}`}
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
                            <action.icon className="w-4 h-4 text-orange-500" />
                            {action.text}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 items-center bg-white rounded-xl shadow-md p-2 border border-gray-200">
                    <Input
                        type="text"
                        placeholder="Tell me about your eating habits..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim()}
                        className={`rounded-lg px-4 py-2 ${input.trim()
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
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
