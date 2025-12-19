import {
    Settings as SettingsIcon, Shield, Trash2,
    Type, Headphones, HelpCircle,
    ChevronRight, Info, Moon, Sun, ZapOff
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';

interface AppSettings {
    theme: string;
    fontSize: string;
    reducedMotion: boolean;
    saveHistory: boolean;
    personalization: boolean;
    voiceEnabled: boolean;
}

interface SettingsProps {
    settings: AppSettings;
    onUpdate: (key: string, value: any) => void;
}

export function Settings({ settings, onUpdate }: SettingsProps) {
    return (
        <div className="h-full flex flex-col p-6 lg:p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-8 p-1 text-left">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-black dark:from-white dark:to-gray-200 flex items-center justify-center shadow-xl">
                        <SettingsIcon className="w-7 h-7 text-white dark:text-gray-900" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Settings</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Customize your wellness environment</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 max-w-3xl">
                {/* 1. Appearance & Theme */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        <Sun className="w-3.5 h-3.5" />
                        Visual Experience
                    </div>
                    <Card className="overflow-hidden border-0 bg-white dark:bg-black/20 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100 dark:divide-white/5">
                                <div className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${settings.theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-600'}`}>
                                            {settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">Dark Mode</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Reduce eye strain in low-light environments.</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.theme === 'dark'}
                                        onCheckedChange={(checked) => onUpdate('theme', checked ? 'dark' : 'light')}
                                    />
                                </div>
                                <div className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
                                            <ZapOff className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">Reduced Motion</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Maximize performance by disabling animations.</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.reducedMotion}
                                        onCheckedChange={(checked) => onUpdate('reducedMotion', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 2. Accessibility */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        <Type className="w-3.5 h-3.5" />
                        Accessibility & Voice
                    </div>
                    <Card className="border-0 bg-white dark:bg-black/20 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                        <CardContent className="p-6 space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <label className="font-semibold text-gray-900 dark:text-gray-100">Relative Font Size</label>
                                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                                        {settings.fontSize === 'normal' ? 'Standard' : settings.fontSize}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-5 px-2">
                                    <span className="text-xs font-bold text-gray-400">A</span>
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="1"
                                        className="flex-1 accent-blue-600 cursor-pointer h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none"
                                        value={settings.fontSize === 'small' ? 1 : settings.fontSize === 'normal' ? 2 : 3}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            onUpdate('fontSize', val === 1 ? 'small' : val === 2 ? 'normal' : 'large');
                                        }}
                                    />
                                    <span className="text-xl font-black text-gray-400">A</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                            <Headphones className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">Voice Output</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Synthetic speech for AI responses.</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.voiceEnabled}
                                        onCheckedChange={(checked) => onUpdate('voiceEnabled', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 3. Privacy & Security */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        <Shield className="w-3.5 h-3.5" />
                        Privacy & Safety
                    </div>
                    <Card className="border-0 bg-blue-500/5 dark:bg-blue-400/5 shadow-sm ring-1 ring-blue-500/10 border-l-4 border-l-blue-500">
                        <CardContent className="p-5 flex gap-5">
                            <div className="p-3 bg-blue-500/10 rounded-2xl h-fit">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-blue-900 dark:text-blue-100">Local-First Security</h4>
                                    <Badge className="bg-blue-500 text-white border-0 text-[10px] font-bold uppercase tracking-wider">Active</Badge>
                                </div>
                                <p className="text-sm text-blue-700/80 dark:text-blue-200/60 leading-relaxed text-left">
                                    Your personal data, chat transcripts, and mood analytics are processed entirely on this device and encrypted at rest.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-600 transition-all group ring-1 ring-red-500/10">
                        <div className="flex items-center gap-4">
                            <Trash2 className="w-5 h-5" />
                            <div className="text-left">
                                <p className="font-semibold">Clear Sensitive Data</p>
                                <p className="text-xs opacity-70">Wipe all history from this device permanently.</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100 transition-opacity" />
                    </button>
                </section>

                {/* Footer Info */}
                <section className="pt-8 pb-12 text-center border-t border-gray-100 dark:border-white/5">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center gap-8">
                            <button className="text-sm font-medium text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" /> Support
                            </button>
                            <button className="text-sm font-medium text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2">
                                <Info className="w-4 h-4" /> Privacy Policy
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-300 dark:text-gray-600 uppercase tracking-[0.3em] font-bold">
                            Engine v2.4.0 • Build Hybrid-Secure
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
