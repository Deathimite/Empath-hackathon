import { useState, useRef, useEffect } from 'react';
import { BookOpen, Save, Tag, Sparkles, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface JournalEntry {
    id: string;
    content: string;
    prompt: string;
    moodTag?: 'lighter' | 'same' | 'heavier';
    timestamp: Date;
}

const JOURNAL_PROMPTS = [
    "What's been weighing on you lately?",
    "What thought keeps coming back today?",
    "What do you wish someone understood right now?",
    "What's one thing you're proud of this week?",
    "What would make tomorrow better than today?",
    "What emotions are you carrying right now?",
    "If you could tell your past self one thing, what would it be?",
    "What's something small that brought you comfort recently?",
];

export function Journaling() {
    const [currentPrompt, setCurrentPrompt] = useState(JOURNAL_PROMPTS[0]);
    const [content, setContent] = useState('');
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [showMoodTag, setShowMoodTag] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Random prompt on load
        setCurrentPrompt(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);
    }, []);

    const getNewPrompt = () => {
        const remaining = JOURNAL_PROMPTS.filter(p => p !== currentPrompt);
        setCurrentPrompt(remaining[Math.floor(Math.random() * remaining.length)]);
    };

    const handleSave = (moodTag?: 'lighter' | 'same' | 'heavier') => {
        if (!content.trim()) return;

        const entry: JournalEntry = {
            id: Date.now().toString(),
            content: content.trim(),
            prompt: currentPrompt,
            moodTag,
            timestamp: new Date(),
        };

        setEntries(prev => [entry, ...prev]);
        setContent('');
        setShowMoodTag(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        getNewPrompt();
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Reflective Journaling</h2>
                        <p className="text-gray-600 text-sm">A private space to process your thoughts</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">Private</Badge>
                    <Badge variant="outline">No judgment</Badge>
                </div>
            </div>

            {/* Safety Message */}
            <Card className="border-0 shadow-sm bg-amber-50 mb-4">
                <CardContent className="py-3 px-4">
                    <p className="text-sm text-amber-800">
                        💛 You don't need to write perfectly. Just write honestly. This space is yours.
                    </p>
                </CardContent>
            </Card>

            {/* Prompt Card */}
            <Card className="border-0 shadow-md mb-4">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            Today's Prompt
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={getNewPrompt}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Different prompt
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-gray-900 font-medium">{currentPrompt}</p>
                </CardContent>
            </Card>

            {/* Writing Area */}
            <div className="flex-1 mb-4">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing here... or ignore the prompt and write whatever's on your mind."
                    className="w-full h-full min-h-[200px] p-4 rounded-xl border border-gray-200 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-900"
                />
            </div>

            {/* Action Area */}
            {showMoodTag ? (
                <Card className="border-0 shadow-md">
                    <CardContent className="py-4">
                        <p className="text-sm text-gray-600 mb-3">How do you feel after writing? (Optional)</p>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                onClick={() => handleSave('lighter')}
                                className="hover:bg-green-50 hover:border-green-300"
                            >
                                😌 Lighter
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleSave('same')}
                                className="hover:bg-gray-100"
                            >
                                😐 Same
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleSave('heavier')}
                                className="hover:bg-blue-50 hover:border-blue-300"
                            >
                                😔 Heavier
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => handleSave()}
                                className="text-gray-500"
                            >
                                Skip
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowMoodTag(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="flex gap-3">
                    <Button
                        onClick={() => content.trim() && setShowMoodTag(true)}
                        disabled={!content.trim()}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaved ? 'Saved!' : 'Save Entry'}
                    </Button>
                    {entries.length > 0 && (
                        <Button variant="outline" className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            {entries.length} {entries.length === 1 ? 'Entry' : 'Entries'}
                        </Button>
                    )}
                </div>
            )}

            {/* Previous Entries Preview */}
            {entries.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Recent entries</p>
                    <div className="space-y-2">
                        {entries.slice(0, 2).map(entry => (
                            <Card key={entry.id} className="border-0 shadow-sm bg-gray-50">
                                <CardContent className="py-3 px-4">
                                    <p className="text-sm text-gray-700 line-clamp-2">{entry.content}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {entry.timestamp.toLocaleDateString()}
                                        {entry.moodTag && ` • Felt ${entry.moodTag}`}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
