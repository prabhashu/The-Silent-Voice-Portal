'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Send, CheckCircle2, AlertTriangle, MessageSquareHeart, User, Phone, HeartPulse, ArrowRight, Bot, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Home() {
  const [reportText, setReportText] = useState('');
  const [category, setCategory] = useState('General');
  const [studentName, setStudentName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const categories = [
    'Bullying / Harassment',
    'Mental Health / Stress',
    'Safety Risk',
    'Substance / Drug Issue',
    'Self-Harm / Suicidal Thoughts',
    'Cyberbullying',
    'Family / Home Problems',
    'Academic Pressure',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText,
          category,
          studentName: studentName.trim() || 'Anonymous',
          contactInfo: contactInfo.trim() || 'None provided'
        }),
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        throw new Error("The server encountered an error and could not complete the request. Please check if your database is connected or if the AI model timed out.");
      }

      if (!res.ok) throw new Error(data?.error || 'Something went wrong');

      setIsSuccess(true);
      setReportText('');
      setStudentName('');
      setContactInfo('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-indigo-500/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background gradients */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none"
      />

      <div className="max-w-2xl w-full z-10 my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-6 ring-1 ring-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
            <Shield className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Pannala National School
          </h1>
          <p className="text-indigo-400 font-semibold tracking-widest uppercase text-sm mb-4">The Silent Voice Portal</p>
          <p className="text-neutral-400 text-lg md:text-xl max-w-lg mx-auto">
            A safe space to report concerns. Your voice matters, and your identity remains protected.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit}
                className="space-y-6 relative z-10"
              >
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                    <MessageSquareHeart className="w-4 h-4" />
                    How can we help?
                  </span>
                  <span className="text-xs font-medium bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-indigo-500/20">
                    <Lock className="w-3 h-3" />
                    Secure Submission
                  </span>
                </div>

                <div className="space-y-5">
                  {/* Category Selection */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat, idx) => (
                      <motion.button
                        key={cat}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05, duration: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                          category === cat
                            ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                            : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300"
                        )}
                      >
                        {cat}
                      </motion.button>
                    ))}
                  </div>

                  {/* Main Report Area */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-500"></div>
                    <textarea
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      placeholder="Type your concern here... (English, Sinhala, or Singlish)"
                      className="w-full h-40 bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent resize-none transition-all relative z-10"
                      required
                    />
                  </div>

                  {/* Optional Identity Section Toggle */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowOptionalFields(!showOptionalFields)}
                      className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                      {showOptionalFields ? "Hide Optional Details" : "+ Add Contact Details (Optional)"}
                    </button>

                    <AnimatePresence>
                      {showOptionalFields && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30 space-y-4">
                            <p className="text-xs text-neutral-500 flex items-center gap-2">
                              <Lock className="w-3 h-3" /> By default, this report is 100% anonymous. Only fill these if you want a counselor to reach out to you directly.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                  type="text"
                                  value={studentName}
                                  onChange={(e) => setStudentName(e.target.value)}
                                  placeholder="Your Name"
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-neutral-200 focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-neutral-600 outline-none"
                                />
                              </div>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                  type="text"
                                  value={contactInfo}
                                  onChange={(e) => setContactInfo(e.target.value)}
                                  placeholder="Phone / Email / Class"
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-neutral-200 focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-neutral-600 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || !reportText.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Encrypting & Sending...
                    </span>
                  ) : (
                    <>
                      Submit Securely
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6 relative z-10"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 mb-2 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Your voice has been heard.</h3>
                  <p className="text-neutral-400 max-w-sm mx-auto">
                    Thank you for speaking up. Your report has been securely sent and is being reviewed by a counselor.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setCategory('General');
                  }}
                  className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors mt-4"
                >
                  Submit another report
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Link to Solutions Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-6"
        >
          <Link href="/solutions" className="block group">
            <div className="bg-gradient-to-r from-pink-900/20 to-indigo-900/20 backdrop-blur-md border border-neutral-800 hover:border-pink-500/30 rounded-3xl p-6 transition-all duration-300 relative overflow-hidden flex items-center justify-between">

              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                  <HeartPulse className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Self-Care & Solutions Toolkit</h2>
                  <p className="text-sm text-neutral-400">Guides for Exam Stress, Anxiety, and Depression.</p>
                </div>
              </div>

              <div className="relative z-10 p-2 bg-neutral-900 rounded-full border border-neutral-800 group-hover:bg-pink-500/10 group-hover:border-pink-500/30 transition-colors">
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-pink-400" />
              </div>
            </div>
          </Link>
        </motion.div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-4 text-xs text-neutral-600">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> 256-bit Encrypted
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> No IP Logging
            </span>
          </div>

          <div className="text-xs text-neutral-500 font-medium tracking-wide">
            AI Innovation by <span className="text-indigo-400">Nadiv Bhagya</span>
          </div>
        </div>
      </div>

      {/* Floating AI Agent Button (Coming Soon) */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 z-[100] group"
      >
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-4 w-48 p-3 bg-neutral-900 border border-indigo-500/30 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform origin-bottom-right">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Coming Soon</span>
          </div>
          <p className="text-xs text-neutral-300">
            Real-time AI Counselor to help you problem-solve instantly.
          </p>
          {/* Arrow */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-neutral-900 border-b border-r border-indigo-500/30 transform rotate-45"></div>
        </div>

        {/* Floating Action Button */}
        <button className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-110 transition-all duration-300 cursor-help border border-white/10">
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute top-0 right-0 flex w-3 h-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-indigo-600"></span>
          </span>
        </button>
      </motion.div>
    </main>
  );
}
