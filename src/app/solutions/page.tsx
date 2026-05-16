'use client';

import { motion } from 'framer-motion';
import { HeartPulse, BookOpen, Wind, Activity, Stethoscope, ArrowLeft, Bot } from 'lucide-react';
import Link from 'next/link';

export default function Solutions() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-indigo-500/30 p-4 md:p-10 relative overflow-hidden">
      {/* Animated Background gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, -50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-900/10 blur-[120px] pointer-events-none" 
      />

      <div className="max-w-5xl mx-auto z-10 relative">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Reporting Portal
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-pink-500/10 rounded-2xl mb-6 ring-1 ring-pink-500/20 shadow-[0_0_40px_rgba(236,72,153,0.1)]">
            <HeartPulse className="w-8 h-8 text-pink-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Self-Care & Solutions
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl">
            You are not alone. While you wait for a counselor to respond, try these actionable steps and grounding techniques to help calm your mind.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exam Stress */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-neutral-900/50 backdrop-blur-md p-8 rounded-3xl border border-neutral-800 hover:border-indigo-500/40 transition-colors"
          >
            <div className="p-3 bg-indigo-500/10 rounded-xl inline-block mb-4">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Exam Stress & Burnout</h3>
            <p className="text-neutral-400 text-sm mb-4">Feeling overwhelmed by academics is common. Here's how to tackle it without burning out:</p>
            <ul className="text-sm text-neutral-300 space-y-3 list-none">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" /> Use the Pomodoro Technique: Study for 25 minutes, then take a strict 5-minute break.</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" /> Hydrate and avoid heavy caffeine before bed.</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" /> Keep perspective: An exam measures your memory on one day, not your self-worth or your entire future.</li>
            </ul>
          </motion.div>

          {/* Panic & Anxiety */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-neutral-900/50 backdrop-blur-md p-8 rounded-3xl border border-neutral-800 hover:border-amber-500/40 transition-colors"
          >
            <div className="p-3 bg-amber-500/10 rounded-xl inline-block mb-4">
              <Activity className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Panic & Anxiety Attacks</h3>
            <p className="text-neutral-400 text-sm mb-4">When everything feels like it's spinning, use the <strong>5-4-3-2-1 Grounding Method</strong>:</p>
            <ul className="text-sm text-neutral-300 space-y-2">
              <li><strong className="text-amber-400">5</strong> things you can see right now.</li>
              <li><strong className="text-amber-400">4</strong> things you can physically feel (texture of clothes, chair).</li>
              <li><strong className="text-amber-400">3</strong> things you can hear (birds, a fan, traffic).</li>
              <li><strong className="text-amber-400">2</strong> things you can smell.</li>
              <li><strong className="text-amber-400">1</strong> good thing about yourself.</li>
            </ul>
          </motion.div>

          {/* Breathing Exercise */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-neutral-900/50 backdrop-blur-md p-8 rounded-3xl border border-neutral-800 hover:border-emerald-500/40 transition-colors"
          >
            <div className="p-3 bg-emerald-500/10 rounded-xl inline-block mb-4">
              <Wind className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Box Breathing</h3>
            <p className="text-neutral-400 text-sm mb-4">This technique is used by athletes and Navy SEALs to instantly calm their nervous system and lower their heart rate.</p>
            <ol className="text-sm text-neutral-300 space-y-3 list-decimal pl-4">
              <li className="pl-2">Breathe in deeply through your nose for <strong>4 seconds</strong>.</li>
              <li className="pl-2">Hold your breath inside for <strong>4 seconds</strong>.</li>
              <li className="pl-2">Exhale slowly through your mouth for <strong>4 seconds</strong>.</li>
              <li className="pl-2">Hold your lungs empty for <strong>4 seconds</strong>.</li>
              <li className="pl-2">Repeat 4 times.</li>
            </ol>
          </motion.div>

          {/* Virtual Doctor / Depression */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-neutral-900/50 backdrop-blur-md p-8 rounded-3xl border border-neutral-800 hover:border-cyan-500/40 transition-colors"
          >
            <div className="p-3 bg-cyan-500/10 rounded-xl inline-block mb-4">
              <Stethoscope className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">The "Virtual Doctor" (Depression)</h3>
            <p className="text-neutral-400 text-sm mb-4">While clinical depression requires a professional, you can practice this daily "Natural Medicine":</p>
            <ul className="text-sm text-neutral-300 space-y-3 list-none">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" /> <strong>Vitamin D & Light:</strong> Get at least 15 minutes of direct morning sunlight outside.</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" /> <strong>Movement:</strong> Walk for 20 minutes to release endorphins.</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" /> <strong>Connection:</strong> Talk to at least one friend or family member today. Isolation makes it worse.</li>
            </ul>
          </motion.div>
        </div>

        {/* AI Agent Coming Soon */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-xl p-8 rounded-3xl border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.1)] relative overflow-hidden group"
        >
          {/* Animated background glow for the AI card */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="p-4 bg-indigo-500/20 rounded-2xl ring-1 ring-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <Bot className="w-10 h-10 text-indigo-300" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-full text-indigo-300 text-xs font-bold tracking-widest uppercase mb-2">
                Coming Soon
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Interactive AI Counselor</h3>
              <p className="text-indigo-200/80 text-sm md:text-base max-w-2xl">
                A highly advanced, 24/7 empathetic AI agent designed to chat with you in real-time, understand your problems, and actively guide you through personalized problem-solving strategies.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 p-6 bg-red-500/5 border border-red-500/20 rounded-3xl text-center shadow-[0_0_30px_rgba(239,68,68,0.05)]"
        >
          <h3 className="text-xl font-bold text-red-400 mb-2">Emergency Lifeline</h3>
          <p className="text-neutral-300 mb-4 max-w-xl mx-auto">
            If you are having thoughts of self-harm or suicide, please know that you are loved and help is immediately available right now. 
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:1926" className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-colors">
              Call 1926 (Nat. Mental Health)
            </a>
            <a href="tel:1333" className="px-8 py-4 bg-red-950 hover:bg-red-900 border border-red-800 text-red-100 font-bold rounded-2xl transition-colors">
              Call 1333 (Sumithrayo)
            </a>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 pb-8">
          <div className="text-xs text-neutral-500 font-medium tracking-wide">
            AI Innovation by <span className="text-indigo-400">Nadiv Bhagya</span>
          </div>
        </div>
      </div>
    </main>
  );
}
