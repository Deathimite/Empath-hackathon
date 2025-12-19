import { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    emotion?: string;
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi there! I'm here to support you. How are you feeling today? Feel free to share what's on your mind.",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [userId] = useState<string>(() => {
        // Get user ID from localStorage or create new one
        const stored = localStorage.getItem('empath_user_id');
        if (stored) return stored;
        const newId = `user_${Date.now()}`;
        localStorage.setItem('empath_user_id', newId);
        return newId;
    });
    const scrollRef = useRef<HTMLDivElement>(null);

    const quickActions = [
        { icon: Sparkles, text: 'Feeling overwhelmed' },
        { icon: Sparkles, text: 'Future worries' },
        { icon: Sparkles, text: 'Stress management' },
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

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

        try {
            // Call backend API using environment variable
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text.trim(),
                    user_id: userId
                }),
                credentials: 'include', // Include cookies for session
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Server error');
            }

            setTimeout(() => {
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: data.response,
                    sender: 'bot',
                    timestamp: new Date(),
                    emotion: data.emotion,
                };

                setMessages((prev) => [...prev, botMessage]);
                setIsTyping(false);
            }, 800);
        } catch (error) {
            console.error('Error sending message:', error);
            setTimeout(() => {
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `Connection Error: ${error instanceof Error ? error.message : String(error)}. Please check backend console.`,
                    sender: 'bot',
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, botMessage]);
                setIsTyping(false);
            }, 800);
        }
    };

    const handleQuickAction = (text: string) => {
        sendMessage(text);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6 lg:p-8">
            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
                <div className="space-y-6 pb-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                                <div
                                    className={`rounded-2xl px-6 py-4 shadow-sm backdrop-blur-md ${message.sender === 'user'
                                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none shadow-blue-500/20'
                                        : 'bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white rounded-bl-none ring-1 ring-black/5 dark:ring-white/5'
                                        }`}
                                >
                                    <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                                    <p
                                        className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>

                                {message.sender === 'bot' && (
                                    <div className="flex items-center gap-3 mt-2 ml-2">
                                        <span className="text-xs text-gray-500">Was this helpful?</span>
                                        <button className="text-gray-400 hover:text-green-600 transition-colors">
                                            <ThumbsUp className="w-4 h-4" />
                                        </button>
                                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                                            <ThumbsDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl rounded-bl-none px-6 py-4 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="mt-4 space-y-3">
                {/* Quick Actions */}
                <div className="flex gap-2 flex-wrap mb-2">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => handleQuickAction(action.text)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 transition-all shadow-sm group"
                        >
                            <action.icon className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                            {action.text}
                        </button>
                    ))}
                </div>

                {/* Input Box */}
                <div className="flex gap-2 items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-2 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <Input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent dark:text-white placeholder:text-gray-400"
                    />
                    <Button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim()}
                        className={`rounded-xl h-11 w-11 p-0 flex items-center justify-center transition-all ${input.trim()
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                            }`}
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
