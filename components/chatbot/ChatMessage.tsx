"use client";

import React from "react";
import { Bot, User } from "lucide-react";

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
    <div className={`mb-3 flex w-full animate-[fadeIn_0.25s_ease-out] ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isUser
              ? "bg-[#0d9488] text-white shadow-sm shadow-[#0d9488]/20"
              : "border border-gray-200 bg-white text-gray-600"
          }`}
        >
          {isUser ? <User size={15} /> : <Bot size={15} />}
        </div>

        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          <div
            className={`rounded-2xl px-3.5 py-2.5 text-sm shadow-sm transition-all duration-300 ${
              isUser
                ? "bg-[#0d9488] text-white"
                : "border border-gray-200 bg-white text-gray-800"
            }`}
          >
            <p className="whitespace-pre-wrap leading-6">{message.text}</p>
          </div>
          <span className="mt-1 px-1 text-[11px] text-gray-400">{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
