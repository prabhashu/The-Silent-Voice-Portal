'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  HeartHandshake, 
  RotateCcw, 
  PhoneCall, 
  ShieldCheck, 
  MessageSquare,
  ArrowDownCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp?: string;
  isCrisis?: boolean;
}

interface AiCounselorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

const QUICK_PROMPTS = [
  { label: '💬 Singlish: "Stress wadi"', text: 'Mata exams nisa godak stress wadi. Mata podi help ekak denna puluwanda?' },
  { label: '🌿 தமிழ்: "பரீட்சை பயம்"', text: 'பரீட்சை பயத்தை எப்படி குறைப்பது மற்றும் மன அமைதி பெறுவது என்று கூறுங்கள்.' },
  { label: '💬 Tanglish: "Concentrate panna mudiyala"', text: 'Enakku studies la focus panna mudiyala, stress ah irukku. Enna panrathu?' },
  { label: '🇱🇰 සිංහල: "විභාග පීඩනය"', text: 'මට විභාග පීඩනය පාලනය කරගන්න මගපෙන්වීමක් දෙන්න.' },
  { label: '🧘 4-4-4 Box Breathing', text: 'Can you guide me through a quick calming breathing exercise right now?' },
  { label: '💭 Overthinking', text: 'My mind will not stop overthinking and feeling anxious. How can I calm down?' },
];

export default function AiCounselorModal({ isOpen, onClose, initialPrompt }: AiCounselorModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Hello! I am **The Silent Voice AI Counselor**.\n\nI am here 24/7 as a safe, confidential, and empathetic space for you. You can talk to me in **Singlish** (*'mata bayai'*, *'stress wadi'*), **தமிழ் / Tanglish** (*'enakku bayama irukku'*), **සිංහල**, or **English** — I will always answer in the exact language you speak to me in.\n\nHow are you feeling today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCrisisAlert, setHasCrisisAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history excluding greeting
      const historyPayload = messages.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      
      if (data.isCrisis) {
        setHasCrisisAlert(true);
      }

      const botMessage: ChatMessage = {
        role: 'model',
        content: data.reply || "I am right here with you. Take a deep breath. Please tell me a bit more.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCrisis: data.isCrisis,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: "I'm listening and I want to support you. We had a momentary connection glitch, but please know you are not alone. If you need urgent help, reach out to **1926** or **1333** anytime.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'model',
        content: "Chat cleared. I'm ready to listen whenever you're ready. What's on your mind?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setHasCrisisAlert(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl h-[92vh] sm:h-[650px] bg-neutral-950/95 border border-indigo-500/30 rounded-t-3xl sm:rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.25)] flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-white/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-neutral-950 rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base sm:text-lg">Live AI Counselor</h3>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LIVE 24/7
                  </span>
                </div>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Safe & Confidential (Singlish / தமிழ் / Tanglish / සිංහල / EN)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleResetChat}
                title="Restart chat"
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Crisis Alert Bar if detected */}
          {hasCrisisAlert && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-red-500/15 border-b border-red-500/30 px-4 py-2.5 flex items-center justify-between text-xs text-red-200"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>You are important. If you need urgent crisis support:</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="tel:1926"
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" /> 1926
                </a>
                <a
                  href="tel:1333"
                  className="px-2.5 py-1 bg-red-950 hover:bg-red-900 border border-red-800 text-red-100 font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" /> 1333
                </a>
              </div>
            </motion.div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scroll-smooth">
            {messages.map((msg, idx) => {
              const isBot = msg.role === 'model';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isBot && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 text-indigo-300 mt-1">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isBot 
                      ? 'bg-neutral-900/80 border border-neutral-800 text-neutral-200 shadow-md backdrop-blur-sm' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 font-medium'
                  }`}>
                    {/* Message content formatted with markdown-style line breaks and bold */}
                    <div className="space-y-2 whitespace-pre-wrap">
                      {msg.content.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>
                          {paragraph.split('**').map((chunk, cIdx) => 
                            cIdx % 2 === 1 ? <strong key={cIdx} className={isBot ? "text-indigo-300 font-semibold" : "font-bold text-white"}>{chunk}</strong> : chunk
                          )}
                        </p>
                      ))}
                    </div>

                    <div className={`text-[10px] mt-2 flex items-center gap-1 ${isBot ? 'text-neutral-500' : 'text-indigo-200/80 justify-end'}`}>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 text-indigo-300 mt-1 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl px-4 py-3 text-neutral-400 text-sm flex items-center gap-2 shadow-md">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span>Counselor is reflecting and typing...</span>
                  <div className="flex gap-1 items-center ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-4 py-2 border-t border-neutral-800/60 bg-neutral-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-neutral-500 uppercase font-semibold tracking-wider flex-shrink-0">
              Quick:
            </span>
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendMessage(prompt.text)}
                disabled={isLoading}
                className="flex-shrink-0 text-xs px-3 py-1.5 bg-neutral-900 hover:bg-indigo-950/50 text-neutral-300 hover:text-indigo-200 border border-neutral-800 hover:border-indigo-500/40 rounded-full transition-all duration-200"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 border-t border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type in Singlish, தமிழ், Tanglish, සිංහල, or English..."
                  disabled={isLoading}
                  className="w-full bg-neutral-950/90 border border-neutral-800 focus:border-indigo-500/60 rounded-2xl py-3 pl-4 pr-10 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3.5 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-lg shadow-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500 px-1">
              <span>All conversations are private & secure</span>
              <span>Lifeline: <a href="tel:1926" className="text-indigo-400 hover:underline">1926</a> | <a href="tel:1333" className="text-pink-400 hover:underline">1333</a></span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
