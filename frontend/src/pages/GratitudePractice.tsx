import { useState } from 'react';
import { Smile, Send, Check, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

const GRATITUDE_PROMPTS = [
    "What's one small thing that made today a little better?",
    "Who showed you kindness recently, even in a small way?",
    "What's something you accomplished this week, no matter how small?",
    "What part of your daily routine do you appreciate?",
    "What's something about yourself you're grateful for today?",
    "What challenge helped you grow recently?",
    "What simple pleasure brought you comfort lately?",
];

interface GratitudeEntry {
    prompt: string;
    response: string;
    timestamp: Date;
}

export function GratitudePractice() {
    const [prompts] = useState(() => {
        // Select 3 random prompts
        const shuffled = [...GRATITUDE_PROMPTS].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    });
    const [responses, setResponses] = useState<string[]>(['', '', '']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [entries, setEntries] = useState<GratitudeEntry[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    const handleSubmit = () => {
        const currentResponse = responses[currentIndex];
        if (!currentResponse.trim()) return;

        // Save entry
        setEntries(prev => [...prev, {
            prompt: prompts[currentIndex],
            response: currentResponse,
            timestamp: new Date(),
        }]);

        if (currentIndex < prompts.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handleInputChange = (value: string) => {
        const newResponses = [...responses];
        newResponses[currentIndex] = value;
        setResponses(newResponses);
    };

    const handleSkip = () => {
        if (currentIndex < prompts.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    const resetPractice = () => {
        setResponses(['', '', '']);
        setCurrentIndex(0);
        setIsComplete(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                        <Smile className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Gratitude Practice</h2>
                        <p className="text-gray-600 text-sm">Gently shift your perspective</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">3 prompts</Badge>
                    <Badge variant="outline">Optional</Badge>
                </div>
            </div>

            {/* Safety Message */}
            <Card className="border-0 shadow-sm bg-yellow-50 mb-6">
                <CardContent className="py-3 px-4">
                    <p className="text-sm text-yellow-800">
                        💛 This isn't about forced positivity. It's about noticing small positives, effort, or support when you're ready.
                    </p>
                </CardContent>
            </Card>

            {!isComplete ? (
                <>
                    {/* Progress */}
                    <div className="flex gap-2 mb-6">
                        {prompts.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 flex-1 rounded-full transition-colors ${index < currentIndex
                                        ? 'bg-amber-400'
                                        : index === currentIndex
                                            ? 'bg-amber-200'
                                            : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Current Prompt */}
                    <Card className="border-0 shadow-md flex-1">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-amber-600 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Prompt {currentIndex + 1} of {prompts.length}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-xl text-gray-900 font-medium leading-relaxed">
                                {prompts[currentIndex]}
                            </p>

                            <div className="space-y-4">
                                <Input
                                    value={responses[currentIndex]}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    placeholder="Your response..."
                                    className="text-lg py-6"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                />

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!responses[currentIndex].trim()}
                                        className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        {currentIndex < prompts.length - 1 ? 'Next' : 'Finish'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={handleSkip}
                                        className="text-gray-500"
                                    >
                                        Skip
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                /* Completion */
                <Card className="border-0 shadow-md flex-1 flex flex-col">
                    <CardContent className="py-12 text-center flex-1 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-6 shadow-lg">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Well done</h3>
                        <p className="text-gray-600 mb-8 max-w-md">
                            You took a moment to notice something good. That matters.
                        </p>

                        {entries.length > 0 && (
                            <div className="w-full max-w-md space-y-3 mb-8 text-left">
                                {entries.map((entry, index) => (
                                    <Card key={index} className="border-0 shadow-sm bg-amber-50">
                                        <CardContent className="py-3 px-4">
                                            <p className="text-sm text-amber-700 font-medium">{entry.prompt}</p>
                                            <p className="text-gray-700 mt-1">{entry.response}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        <Button
                            variant="outline"
                            onClick={resetPractice}
                        >
                            Practice again
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
