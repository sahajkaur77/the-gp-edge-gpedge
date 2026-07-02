"use client";

import React from "react";
import ChatAvatar from "./ChatAvatar";

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`mb-4 flex w-full animate-[fadeIn_0.25s_ease-out] ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[92%] items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <ChatAvatar type={isUser ? "user" : "bot"} size="md" />

        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          <div
            className={`rounded-[24px] border px-4 py-3 text-sm shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur transition-all duration-300 ${
              isUser
                ? "border-transparent bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-emerald-500/20"
                : "border-slate-200/80 bg-white/90 text-slate-700"
            }`}
          >
            <p className="whitespace-pre-wrap leading-7">{message.text}</p>
          </div>
          <div className={`mt-2 flex items-center gap-2 px-1 text-[11px] ${isUser ? "text-emerald-600" : "text-slate-400"}`}>
            <span>{isUser ? "You" : "Assistant"}</span>
            <span>•</span>
            <span>{message.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
