import { useState, useEffect, useRef } from 'react';
import { Coffee, Play, X, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const BREAK_SUGGESTIONS = [
    {
        id: 'stretch',
        emoji: '🧘',
        title: 'Stretch',
        description: 'Stand up and stretch your arms above your head for 30 seconds.',
        duration: 1,
    },
    {
        id: 'water',
        emoji: '💧',
        title: 'Hydrate',
        description: 'Get a glass of water and drink it slowly.',
        duration: 2,
    },
    {
        id: 'eyes',
        emoji: '👀',
        title: 'Rest Your Eyes',
        description: 'Look away from your screen at something 20 feet away for 20 seconds.',
        duration: 1,
    },
    {
        id: 'breathe',
        emoji: '🌬️',
        title: 'Deep Breaths',
        description: 'Take 5 slow, deep breaths. In through your nose, out through your mouth.',
        duration: 2,
    },
    {
        id: 'nothing',
        emoji: '🪑',
        title: 'Just Sit',
        description: 'Do absolutely nothing for a minute. No phone, no thoughts to chase.',
        duration: 1,
    },
    {
        id: 'walk',
        emoji: '🚶',
        title: 'Short Walk',
        description: 'Walk around your space for a few minutes. Notice your surroundings.',
        duration: 3,
    },
];

export function MindfulBreak() {
    const [suggestion, setSuggestion] = useState(() =>
        BREAK_SUGGESTIONS[Math.floor(Math.random() * BREAK_SUGGESTIONS.length)]
    );
    const [isActive, setIsActive] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isActive && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsActive(false);
                        setIsComplete(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, timeRemaining]);

    const startBreak = () => {
        setTimeRemaining(suggestion.duration * 60);
        setIsActive(true);
        setIsComplete(false);
    };

    const skipBreak = () => {
        setIsActive(false);
        setIsComplete(true);
    };

    const getNewSuggestion = () => {
        const remaining = BREAK_SUGGESTIONS.filter(s => s.id !== suggestion.id);
        setSuggestion(remaining[Math.floor(Math.random() * remaining.length)]);
        setIsActive(false);
        setIsComplete(false);
        setTimeRemaining(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                        <Coffee className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Mindful Break</h2>
                        <p className="text-gray-600 text-sm">A short pause to reset</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">1-5 min</Badge>
                    <Badge variant="outline">Skippable</Badge>
                </div>
            </div>

            {/* Permission Message */}
            <Card className="border-0 shadow-sm bg-emerald-50 mb-6">
                <CardContent className="py-3 px-4">
                    <p className="text-sm text-emerald-800">
                        🌿 You've been pushing for a while. A short pause might help. Or not—that's okay too.
                    </p>
                </CardContent>
            </Card>

            {/* Main Content */}
            <Card className="border-0 shadow-lg flex-1 flex flex-col items-center justify-center">
                <CardContent className="text-center py-12 w-full max-w-md">
                    {!isComplete ? (
                        <>
                            <div className="text-6xl mb-6">{suggestion.emoji}</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{suggestion.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">{suggestion.description}</p>

                            {isActive ? (
                                <>
                                    <p className="text-5xl font-light text-gray-900 mb-8">
                                        {formatTime(timeRemaining)}
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <Button
                                            variant="outline"
                                            onClick={skipBreak}
                                            className="text-gray-500"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            End early
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-500 mb-6">
                                        {suggestion.duration} minute{suggestion.duration > 1 ? 's' : ''}
                                    </p>
                                    <div className="flex gap-3 justify-center flex-wrap">
                                        <Button
                                            onClick={startBreak}
                                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Start Break
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={getNewSuggestion}
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Different activity
                                        </Button>
                                    </div>
                                    <button
                                        onClick={() => setIsComplete(true)}
                                        className="mt-6 text-sm text-gray-400 hover:text-gray-600"
                                    >
                                        Skip for now
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="text-6xl mb-6">☺️</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome back</h3>
                            <p className="text-gray-600 mb-8">Go easy. You're doing fine.</p>
                            <Button
                                variant="outline"
                                onClick={getNewSuggestion}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Take another break
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Quick Breaks */}
            <div className="mt-4">
                <p className="text-sm text-gray-500 mb-3">Quick alternatives</p>
                <div className="flex gap-2 flex-wrap">
                    {BREAK_SUGGESTIONS.filter(s => s.id !== suggestion.id).slice(0, 3).map((s) => (
                        <button
                            key={s.id}
                            onClick={() => {
                                setSuggestion(s);
                                setIsActive(false);
                                setIsComplete(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors shadow-sm"
                        >
                            <span>{s.emoji}</span>
                            {s.title}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
