import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Smile, Frown, Meh, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

interface MoodEntry {
    emotion: string;
    intensity: number;
    note: string;
    timestamp: string;
}

interface DailyMood {
    day: string;
    happy: number;
    sad: number;
    neutral: number;
    date: string; // for sorting if needed
}

export function MoodDashboard() {
    const [loading, setLoading] = useState(true);
    const [moodData, setMoodData] = useState<DailyMood[]>([]);
    const [totalEntries, setTotalEntries] = useState(0);
    const [emotionCounts, setEmotionCounts] = useState({ happy: 0, sad: 0, neutral: 0 });

    useEffect(() => {
        fetchMoodHistory();
    }, []);

    const fetchMoodHistory = async () => {
        try {
            const response = await fetch('http://localhost:5000/mood/history?days=7', {
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                processMoodData(data.mood_history);
            }
        } catch (error) {
            console.error('Failed to fetch mood history:', error);
        } finally {
            setLoading(false);
        }
    };

    const processMoodData = (history: MoodEntry[]) => {
        // Initialize last 7 days with 0 values
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const last7Days: DailyMood[] = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            last7Days.push({
                day: days[d.getDay()],
                happy: 0,
                sad: 0,
                neutral: 0,
                date: d.toISOString().split('T')[0]
            });
        }

        const counts = { happy: 0, sad: 0, neutral: 0 };
        let entries = 0;

        history.forEach(entry => {
            const date = entry.timestamp.split('T')[0];
            const emotion = entry.emotion.toLowerCase();

            // Update total counts
            if (emotion.includes('happy') || emotion.includes('joy') || emotion.includes('excited')) {
                counts.happy++;
            } else if (emotion.includes('sad') || emotion.includes('angry') || emotion.includes('anxiety')) {
                counts.sad++;
            } else {
                counts.neutral++;
            }
            entries++;

            // Update daily data
            const dayStat = last7Days.find(d => d.date === date);
            if (dayStat) {
                if (emotion.includes('happy') || emotion.includes('joy') || emotion.includes('excited')) {
                    dayStat.happy++;
                } else if (emotion.includes('sad') || emotion.includes('angry') || emotion.includes('anxiety')) {
                    dayStat.sad++;
                } else {
                    dayStat.neutral++;
                }
            }
        });

        setMoodData(last7Days);
        setEmotionCounts(counts);
        setTotalEntries(entries);
    };

    const emotionSummary = [
        { emotion: 'Happy', count: emotionCounts.happy, color: 'bg-green-500', icon: Smile },
        { emotion: 'Sad', count: emotionCounts.sad, color: 'bg-blue-500', icon: Frown },
        { emotion: 'Neutral', count: emotionCounts.neutral, color: 'bg-gray-400', icon: Meh },
    ];

    const maxValue = Math.max(...moodData.map((d) => d.happy + d.sad + d.neutral), 1); // Minimum 1 to avoid divide by zero

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Mood Analytics</h2>
                <p className="text-gray-600 mt-1">Track your emotional patterns over time</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {emotionSummary.map((item) => (
                    <Card key={item.emotion} className="border-0 shadow-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <item.icon className="w-5 h-5" />
                                {item.emotion}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{item.count}</div>
                            <p className="text-sm text-gray-500 mt-1">interactions this week</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Weekly Chart */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Weekly Mood Trends
                    </CardTitle>
                    <CardDescription>Your emotional patterns over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {moodData.length > 0 ? (
                            moodData.map((day) => (
                                <div key={day.date} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700 w-12">{day.day}</span>
                                        <div className="flex-1 mx-4 h-8 bg-gray-100 rounded-lg overflow-hidden flex">
                                            {day.happy > 0 && (
                                                <div
                                                    className="bg-green-500 transition-all"
                                                    style={{ width: `${(day.happy / maxValue) * 100}%` }}
                                                    title={`Happy: ${day.happy}`}
                                                />
                                            )}
                                            {day.sad > 0 && (
                                                <div
                                                    className="bg-blue-500 transition-all"
                                                    style={{ width: `${(day.sad / maxValue) * 100}%` }}
                                                    title={`Sad: ${day.sad}`}
                                                />
                                            )}
                                            {day.neutral > 0 && (
                                                <div
                                                    className="bg-gray-400 transition-all"
                                                    style={{ width: `${(day.neutral / maxValue) * 100}%` }}
                                                    title={`Neutral: ${day.neutral}`}
                                                />
                                            )}
                                        </div>
                                        <span className="text-gray-500 text-xs w-16 text-right">
                                            {day.happy + day.sad + day.neutral} total
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No mood data available yet. Start chatting to track your mood!
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6 mt-6 pt-6 border-t">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <span className="text-sm text-gray-600">Happy</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            <span className="text-sm text-gray-600">Sad</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-full" />
                            <span className="text-sm text-gray-600">Neutral</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Insights */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-green-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Insights
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {totalEntries > 0 ? (
                        <>
                            <p className="text-sm text-gray-700">
                                📈 You have logged {totalEntries} mood entries this week.
                            </p>
                            {emotionCounts.happy > emotionCounts.sad ? (
                                <p className="text-sm text-gray-700">
                                    ✨ You've been generally positive lately!
                                </p>
                            ) : emotionCounts.sad > emotionCounts.happy ? (
                                <p className="text-sm text-gray-700">
                                    💙 It's okay to have tough days. We're here for you.
                                </p>
                            ) : (
                                <p className="text-sm text-gray-700">
                                    ⚖️ Your mood has been quite balanced.
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-gray-700">
                            Start chatting with the bot to generate mood insights!
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
