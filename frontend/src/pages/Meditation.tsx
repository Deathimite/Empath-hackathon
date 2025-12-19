import { useState, useEffect, useRef } from 'react';
import { Heart, Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const MEDITATION_TYPES = [
    {
        id: 'breath',
        title: 'Breath Awareness',
        description: 'Focus on your natural breathing rhythm',
        duration: 3,
        color: 'from-blue-400 to-blue-600',
        steps: [
            "Find a comfortable position and close your eyes.",
            "Take a deep breath in through your nose...",
            "And slowly exhale through your mouth...",
            "Now, let your breathing return to its natural rhythm.",
            "Simply observe each breath without trying to change it.",
            "Notice the rise and fall of your chest...",
            "If your mind wanders, gently return to your breath.",
            "There's nothing to achieve. Just be present.",
            "Continue this gentle observation...",
            "You're doing great. Keep breathing naturally.",
        ],
    },
    {
        id: 'body',
        title: 'Body Scan',
        description: 'Notice and release tension throughout your body',
        duration: 5,
        color: 'from-green-400 to-green-600',
        steps: [
            "Settle into a comfortable position.",
            "Bring your attention to your feet...",
            "Notice any sensations there. No need to change anything.",
            "Slowly move your awareness up to your ankles and calves...",
            "Notice any tension. Let it soften if it wants to.",
            "Continue up to your knees and thighs...",
            "Bring attention to your hips and lower back...",
            "Notice your stomach and chest...",
            "Let your shoulders drop away from your ears...",
            "Finally, notice your neck, face, and the top of your head.",
            "Take a moment to feel your whole body at once.",
        ],
    },
    {
        id: 'thoughts',
        title: 'Thought Observation',
        description: 'Watch thoughts come and go like clouds',
        duration: 5,
        color: 'from-purple-400 to-purple-600',
        steps: [
            "Close your eyes and settle in.",
            "Imagine your mind is like the sky...",
            "Thoughts are clouds passing through.",
            "You don't need to follow any thought.",
            "Just notice when a thought appears...",
            "And watch it drift away.",
            "No thought is good or bad here.",
            "Simply observe without engagement.",
            "If you get caught in a thought, that's okay.",
            "Gently return to watching the sky of your mind.",
            "Let thoughts come. Let them go. You are the sky.",
        ],
    },
];

export function Meditation() {
    const [selectedType, setSelectedType] = useState(MEDITATION_TYPES[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [silenceMode, setSilenceMode] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        setTimeRemaining(selectedType.duration * 60);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, [selectedType]);

    useEffect(() => {
        if (isPlaying && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev - 1;
                });

                // Advance step every 30 seconds
                const elapsed = selectedType.duration * 60 - timeRemaining + 1;
                const stepDuration = (selectedType.duration * 60) / selectedType.steps.length;
                const newStepIndex = Math.min(
                    Math.floor(elapsed / stepDuration),
                    selectedType.steps.length - 1
                );
                setCurrentStepIndex(newStepIndex);
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, timeRemaining, selectedType]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const reset = () => {
        setTimeRemaining(selectedType.duration * 60);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                        <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Mindfulness Meditation</h2>
                        <p className="text-gray-600 text-sm">This is just a pause. Nothing to achieve.</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">Guided</Badge>
                    <Badge variant="outline">3-5 min</Badge>
                </div>
            </div>

            {/* Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {MEDITATION_TYPES.map((type) => (
                    <Card
                        key={type.id}
                        className={`border-0 shadow-sm cursor-pointer transition-all ${selectedType.id === type.id
                            ? 'ring-2 ring-pink-400 shadow-md'
                            : 'hover:shadow-md'
                            }`}
                        onClick={() => setSelectedType(type)}
                    >
                        <CardHeader className="pb-2 pt-3 px-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${type.color}`} />
                                {type.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-3 pb-3">
                            <p className="text-xs text-gray-600">{type.description}</p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                {type.duration} min
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Timer Display */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 text-white flex-1 flex flex-col items-center justify-center mb-4">
                <CardContent className="text-center py-12">
                    <p className="text-6xl font-light mb-6">{formatTime(timeRemaining)}</p>

                    {!silenceMode && isPlaying && (
                        <p className="text-lg text-gray-300 max-w-md mx-auto mb-8 leading-relaxed animate-fade-in">
                            {selectedType.steps[currentStepIndex]}
                        </p>
                    )}

                    <div className="flex gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`rounded-full w-16 h-16 ${isPlaying
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
                                }`}
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                        </Button>
                        <Button
                            size="lg"
                            variant="ghost"
                            onClick={reset}
                            className="rounded-full w-16 h-16 text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </Button>
                    </div>

                    <button
                        onClick={() => setSilenceMode(!silenceMode)}
                        className={`mt-6 text-sm ${silenceMode ? 'text-pink-400' : 'text-gray-500'} hover:text-gray-300 transition-colors`}
                    >
                        {silenceMode ? '🔇 Silence mode on' : 'Enable silence mode'}
                    </button>
                </CardContent>
            </Card>

            {/* Completion Message */}
            {timeRemaining === 0 && (
                <Card className="border-0 shadow-sm bg-green-50">
                    <CardContent className="py-4 text-center">
                        <p className="text-green-800">
                            🌿 Well done. Take a moment before returning to your day.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
