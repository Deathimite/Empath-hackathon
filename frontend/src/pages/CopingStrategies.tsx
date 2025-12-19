import { Heart, Brain, Wind, Sun, Music, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function CopingStrategies() {
    const strategies = [
        {
            id: 1,
            title: 'Deep Breathing Exercise',
            description: 'Take slow, deep breaths to calm your nervous system and reduce stress.',
            icon: Wind,
            category: 'Relaxation',
            duration: '5 min',
            color: 'from-blue-400 to-blue-600',
            steps: [
                'Find a comfortable position',
                'Breathe in slowly through your nose for 4 counts',
                'Hold for 4 counts',
                'Exhale slowly through your mouth for 6 counts',
                'Repeat 5-10 times',
            ],
        },
        {
            id: 2,
            title: 'Gratitude Journaling',
            description: 'Write down three things you\'re grateful for to shift your mindset positively.',
            icon: BookOpen,
            category: 'Mindfulness',
            duration: '10 min',
            color: 'from-green-400 to-green-600',
            steps: [
                'Get a notebook or open a notes app',
                'Think about your day',
                'Write down 3 things you\'re grateful for',
                'Reflect on why each matters to you',
                'Make this a daily habit',
            ],
        },
        {
            id: 3,
            title: 'Progressive Muscle Relaxation',
            description: 'Systematically tense and relax muscle groups to release physical tension.',
            icon: Heart,
            category: 'Physical',
            duration: '15 min',
            color: 'from-purple-400 to-purple-600',
            steps: [
                'Lie down or sit comfortably',
                'Start with your toes - tense for 5 seconds',
                'Release and notice the relaxation',
                'Move up through each muscle group',
                'End with your face and head',
            ],
        },
        {
            id: 4,
            title: 'Mindful Walking',
            description: 'Take a walk while focusing on your senses and the present moment.',
            icon: Sun,
            category: 'Movement',
            duration: '20 min',
            color: 'from-yellow-400 to-orange-600',
            steps: [
                'Go outside or find a quiet space',
                'Walk at a comfortable pace',
                'Notice the sensation of each step',
                'Observe your surroundings without judgment',
                'Return your focus when your mind wanders',
            ],
        },
        {
            id: 5,
            title: 'Positive Affirmations',
            description: 'Repeat positive statements to challenge negative thoughts and build confidence.',
            icon: Brain,
            category: 'Cognitive',
            duration: '5 min',
            color: 'from-pink-400 to-pink-600',
            steps: [
                'Choose 3-5 affirmations that resonate',
                'Stand in front of a mirror',
                'Say each affirmation out loud',
                'Repeat with conviction and belief',
                'Practice daily, especially in the morning',
            ],
        },
        {
            id: 6,
            title: 'Calming Music',
            description: 'Listen to soothing music to regulate emotions and reduce anxiety.',
            icon: Music,
            category: 'Sensory',
            duration: '15 min',
            color: 'from-indigo-400 to-indigo-600',
            steps: [
                'Find a quiet, comfortable space',
                'Choose calming instrumental music',
                'Close your eyes and focus on the sounds',
                'Let the music wash over you',
                'Notice how your body responds',
            ],
        },
    ];

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Coping Strategies</h2>
                <p className="text-gray-600 mt-1">Evidence-based techniques to support your emotional wellbeing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {strategies.map((strategy) => (
                    <Card key={strategy.id} className="border-0 shadow-md hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${strategy.color} flex items-center justify-center shadow-lg`}>
                                    <strategy.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {strategy.category}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {strategy.duration}
                                    </Badge>
                                </div>
                            </div>
                            <CardTitle className="mt-4">{strategy.title}</CardTitle>
                            <CardDescription>{strategy.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-gray-700">How to practice:</h4>
                                <ol className="space-y-2">
                                    {strategy.steps.map((step, index) => (
                                        <li key={index} className="flex gap-3 text-sm text-gray-600">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                                                {index + 1}
                                            </span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                    <CardTitle>💡 Remember</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                    <p>• Different strategies work for different people - experiment to find what helps you most</p>
                    <p>• Consistency is key - regular practice makes these techniques more effective</p>
                    <p>• These are supportive tools, not replacements for professional mental health care</p>
                    <p>• If you're in crisis, please reach out to a mental health professional or crisis hotline</p>
                </CardContent>
            </Card>
        </div>
    );
}
