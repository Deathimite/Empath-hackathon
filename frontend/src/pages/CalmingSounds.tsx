import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Clock, CloudRain, Waves, TreePine, Radio, Flame, Moon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';

const SOUNDS = [
    {
        id: 'rain',
        name: 'Rain',
        icon: CloudRain,
        color: 'from-blue-400 to-blue-600',
        description: 'Gentle rainfall',
        file: '/sound/calming-rain-257596.mp3',
    },
    {
        id: 'ocean',
        name: 'Ocean',
        icon: Waves,
        color: 'from-cyan-400 to-blue-500',
        description: 'Waves on shore',
        file: '/sound/ocean-waves-250310.mp3',
    },
    {
        id: 'forest',
        name: 'Forest',
        icon: TreePine,
        color: 'from-green-400 to-green-600',
        description: 'Birds and breeze',
        file: '/sound/forestbirds-319791.mp3',
    },
    {
        id: 'whitenoise',
        name: 'White Noise',
        icon: Radio,
        color: 'from-gray-400 to-gray-600',
        description: 'Steady static',
        file: '/sound/whitenoise-75254.mp3',
    },
    {
        id: 'fire',
        name: 'Fireplace',
        icon: Flame,
        color: 'from-orange-400 to-red-500',
        description: 'Crackling fire',
        file: '/sound/fire-sounds-405444.mp3',
    },
    {
        id: 'night',
        name: 'Night',
        icon: Moon,
        color: 'from-indigo-400 to-purple-600',
        description: 'Crickets & owls',
        file: '/sound/night-sky-sound-effect-01-321714.mp3',
    },
];

const TIMER_OPTIONS = [
    { label: 'No timer', value: 0 },
    { label: '5 min', value: 5 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '1 hour', value: 60 },
];

export function CalmingSounds() {
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [timer, setTimer] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Handle audio playback
    useEffect(() => {
        if (activeSound && isPlaying) {
            const sound = SOUNDS.find(s => s.id === activeSound);
            if (sound) {
                if (!audioRef.current || audioRef.current.src !== sound.file) {
                    // Create new audio element
                    if (audioRef.current) {
                        audioRef.current.pause();
                    }
                    audioRef.current = new Audio(sound.file);
                    audioRef.current.loop = true;
                }
                audioRef.current.volume = volume / 100;
                audioRef.current.play().catch(console.error);
            }
        } else if (audioRef.current) {
            audioRef.current.pause();
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [activeSound, isPlaying]);

    // Handle volume changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    // Handle timer
    useEffect(() => {
        if (timer > 0 && isPlaying) {
            setTimeRemaining(timer * 60);
            intervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsPlaying(false);
                        setActiveSound(null);
                        if (audioRef.current) {
                            audioRef.current.pause();
                        }
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
    }, [timer, isPlaying]);

    const handleSoundClick = (soundId: string) => {
        if (activeSound === soundId) {
            setIsPlaying(!isPlaying);
        } else {
            setActiveSound(soundId);
            setIsPlaying(true);
            if (timer > 0) {
                setTimeRemaining(timer * 60);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getActiveSound = () => SOUNDS.find(s => s.id === activeSound);

    return (
        <div className="h-full flex flex-col p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Volume2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Calming Sounds</h2>
                        <p className="text-gray-600 text-sm">Passive relief for anxiety, focus, or rest</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">One-tap play</Badge>
                    <Badge variant="outline">Background</Badge>
                </div>
            </div>

            {/* Sound Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {SOUNDS.map((sound) => (
                    <Card
                        key={sound.id}
                        className={`border-0 shadow-sm cursor-pointer transition-all hover:shadow-md ${activeSound === sound.id && isPlaying
                            ? 'ring-2 ring-teal-400 shadow-lg'
                            : ''
                            }`}
                        onClick={() => handleSoundClick(sound.id)}
                    >
                        <CardContent className="p-4 text-center">
                            <div
                                className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${sound.color} flex items-center justify-center text-3xl mb-3 shadow-lg ${activeSound === sound.id && isPlaying ? 'animate-pulse' : ''
                                    }`}
                            >
                                {activeSound === sound.id ? (
                                    isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />
                                ) : (
                                    <sound.icon className="w-7 h-7 text-white" />
                                )}
                            </div>
                            <h3 className="font-medium text-gray-900">{sound.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{sound.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Controls */}
            {activeSound && (
                <Card className="border-0 shadow-md mb-4">
                    <CardContent className="py-6 px-6">
                        <div className="flex items-center gap-4 mb-6">
                            {(() => {
                                const ActiveIcon = getActiveSound()?.icon;
                                return (
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getActiveSound()?.color} flex items-center justify-center shadow-lg`}>
                                        {ActiveIcon && <ActiveIcon className="w-6 h-6 text-white" />}
                                    </div>
                                );
                            })()}
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">Now Playing: {getActiveSound()?.name}</h3>
                                {timer > 0 && timeRemaining > 0 && (
                                    <p className="text-sm text-gray-500">
                                        <Clock className="w-3 h-3 inline mr-1" />
                                        {formatTime(timeRemaining)} remaining
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${isPlaying
                                    ? 'bg-gray-200 hover:bg-gray-300'
                                    : 'bg-teal-500 hover:bg-teal-600 text-white'
                                    }`}
                            >
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                            </button>
                        </div>

                        {/* Volume */}
                        <div className="flex items-center gap-4 mb-4">
                            <VolumeX className="w-4 h-4 text-gray-400" />
                            <Slider
                                value={[volume]}
                                onValueChange={(val) => setVolume(val[0])}
                                max={100}
                                step={1}
                                className="flex-1"
                            />
                            <Volume2 className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-500 w-8">{volume}%</span>
                        </div>

                        {/* Timer */}
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Auto-stop timer</p>
                            <div className="flex gap-2 flex-wrap">
                                {TIMER_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setTimer(opt.value)}
                                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${timer === opt.value
                                            ? 'bg-teal-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {!activeSound && (
                <Card className="border-0 shadow-sm bg-gradient-to-br from-teal-50 to-cyan-50 flex-1 flex items-center justify-center">
                    <CardContent className="text-center py-12">
                        <Volume2 className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                        <p className="text-gray-600">Tap any sound to begin</p>
                        <p className="text-sm text-gray-400 mt-1">No prompts, no interruptions</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
