"use client";

import React from "react";
import { Bot, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onStartConversation: () => void;
  onSelectSuggestion: (prompt: string) => void;
}

const suggestions = [
  { icon: "📚", title: "Ask About Products", prompt: "Tell me about the available products and what they offer." },
  { icon: "🎓", title: "Internship Guidance", prompt: "Help me understand internship guidance and next steps." },
  { icon: "🛠", title: "Support Help", prompt: "I need support help and a quick answer." },
  { icon: "💡", title: "General Questions", prompt: "I have a general question I would like help with." },
];

export default function WelcomeScreen({ onStartConversation, onSelectSuggestion }: WelcomeScreenProps) {
  return (
    <div className="flex h-full items-center justify-center px-2 py-4 sm:px-4 sm:py-6">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-emerald-50/80 to-slate-50 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-8">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="absolute -bottom-10 left-6 h-24 w-24 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-[0_18px_50px_rgba(13,148,136,0.25)] transition-all duration-300 hover:scale-105">
            <Bot size={28} />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/90 px-3 py-1 text-sm font-medium text-emerald-700">
            <Sparkles size={14} />
            AI Assistant
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Welcome to your AI workspace</h3>
          <p className="mt-2 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            Ask anything, explore ideas, and get polished support with a premium conversational experience.
          </p>

          <button
            type="button"
            onClick={onStartConversation}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(13,148,136,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_0_6px_rgba(13,148,136,0.18)] active:scale-95"
          >
            Start Conversation
          </button>

          <div className="mt-7 grid w-full gap-3 sm:grid-cols-2">
            {suggestions.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => onSelectSuggestion(item.prompt)}
                className="group flex items-start gap-3 rounded-[20px] border border-slate-200/80 bg-white/80 p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium text-slate-700">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
