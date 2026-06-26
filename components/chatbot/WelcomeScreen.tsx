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
    <div className="flex h-full items-center justify-center px-3 py-6 sm:px-4">
      <div className="w-full max-w-xl rounded-[28px] border border-[#0d9488]/15 bg-gradient-to-br from-white via-[#f8fffe] to-[#f0fdfa] p-6 shadow-[0_20px_60px_rgba(13,148,136,0.12)] sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0d9488] text-white shadow-lg shadow-[#0d9488]/25 transition-all duration-300 hover:scale-105">
            <Bot size={28} />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#0d9488]/15 bg-[#0d9488]/10 px-3 py-1 text-sm font-medium text-[#0d9488]">
            <Sparkles size={14} />
            AI Assistant
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Welcome to AI Assistant</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
            I’m here to help answer questions, provide guidance, and assist you with a polished, friendly experience.
          </p>

          <button
            type="button"
            onClick={onStartConversation}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0d9488] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0d9488]/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_0_6px_rgba(13,148,136,0.18)] active:scale-95"
          >
            Start Conversation
          </button>

          <div className="mt-7 grid w-full gap-3 sm:grid-cols-2">
            {suggestions.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => onSelectSuggestion(item.prompt)}
                className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
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
