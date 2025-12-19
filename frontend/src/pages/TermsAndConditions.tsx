import { ArrowLeft, FileText, Shield, AlertTriangle } from 'lucide-react';

interface TermsAndConditionsProps {
    onBack: () => void;
}

export function TermsAndConditions({ onBack }: TermsAndConditionsProps) {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                        aria-label="Back"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
                        <p className="text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Important Notice Banner */}
                    <div className="bg-blue-50 border-b border-blue-100 p-6 flex flex-col sm:flex-row gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl h-fit">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Medical Disclaimer</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Empath.ai is an emotional wellness companion powered by AI. It is NOT a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a crisis or medical emergency, please call your local emergency services immediately.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed">
                        {/* Agreement Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <h3 className="text-xl font-semibold text-gray-900">1. Agreement to Terms</h3>
                            </div>
                            <p>
                                By accessing or using Empath.ai, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you may not use our service.
                            </p>
                        </section>

                        {/* Privacy Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-green-500" />
                                <h3 className="text-xl font-semibold text-gray-900">2. Privacy & Data Security</h3>
                            </div>
                            <p className="mb-4">
                                We take your privacy seriously. Your conversations and mood entries are stored securely. However, please note:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                <li>We use industry-standard encryption to protect your data.</li>
                                <li>Your data is private to your account and is not shared with third parties without consent.</li>
                                <li>AI processing is performed to generate responses and analyze emotions.</li>
                                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            </ul>
                        </section>

                        {/* Usage Guidelines */}
                        <section>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Acceptable Use</h3>
                            <p className="mb-4">You agree not to use Empath.ai for any unlawful purpose or in any way that could:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                <li>Harm, threaten, or harass others.</li>
                                <li>Compromise the security of the application.</li>
                                <li>Generate harmful or illegal content.</li>
                                <li>Attempt to reverse engineer the AI technology.</li>
                            </ul>
                        </section>

                        {/* AI Limitations */}
                        <section>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">4. AI Limitations</h3>
                            <p>
                                The chatbot responses are generated by Artificial Intelligence. While we strive for accuracy and empathy, the AI may occasionally generate incorrect or inappropriate responses. Empath.ai does not guarantee the accuracy, completeness, or usefulness of any AI-generated content.
                            </p>
                        </section>

                        {/* Termination */}
                        <section>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Account Termination</h3>
                            <p>
                                We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the service, us, or third parties, or for any other reason.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions?</h3>
                            <p className="text-gray-600 mb-4">
                                If you have any questions about these Terms, please contact us.
                            </p>
                            <button
                                onClick={onBack}
                                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                            >
                                Back to Registration
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
