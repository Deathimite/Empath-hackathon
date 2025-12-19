import { useState } from 'react';
import { MessageCircle, Shield, Heart, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface OnboardingProps {
    onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
    const [name, setName] = useState('');
    const [step, setStep] = useState(1);

    const handleStart = () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2 && name.trim()) {
            localStorage.setItem('empath_username', name);
            onComplete();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {step === 1 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 animate-in fade-in duration-500">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                <MessageCircle className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">Welcome to Empath.ai</h1>
                            <p className="text-lg text-gray-600">Your emotional wellness companion</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                                <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Empathetic Support</h3>
                                    <p className="text-sm text-gray-600">Get non-judgmental emotional support whenever you need it</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                                <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Mood Tracking</h3>
                                    <p className="text-sm text-gray-600">Track your emotional patterns and gain insights over time</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                                <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Private & Secure</h3>
                                    <p className="text-sm text-gray-600">Your conversations are private and stored locally</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleStart}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 text-lg rounded-xl shadow-lg"
                        >
                            Get Started
                        </Button>
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 animate-in fade-in duration-500">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                <MessageCircle className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">What should we call you?</h1>
                            <p className="text-gray-600">This helps us personalize your experience</p>
                        </div>

                        <div className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                                className="w-full px-6 py-6 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                autoFocus
                            />

                            <Button
                                onClick={handleStart}
                                disabled={!name.trim()}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </Button>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            By continuing, you agree that this is a supportive tool and not a replacement for professional mental health care.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
