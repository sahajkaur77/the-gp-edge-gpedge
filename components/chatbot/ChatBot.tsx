"use client";

import { useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";
import { Message } from "./ChatMessage";

const BOT_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ["hello", "hi", "hey"],
    response: "Hello! I’m your AI assistant. I can help with product questions, onboarding, or quick guidance.",
  },
  {
    keywords: ["demo", "show", "example"],
    response: "This is a polished frontend-only chatbot UI built with React, TypeScript, and Tailwind CSS.",
  },
  {
    keywords: ["help", "support"],
    response: "I’m here to assist with a friendly, professional demo experience.",
  },
];

const DEFAULT_RESPONSE = "Thanks for reaching out. This demo is fully frontend-only and runs with mock responses.";

interface ConversationSummary {
  id: string;
  title: string;
  preview: string;
  time: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState("conv-1");
  const [conversations, setConversations] = useState<ConversationSummary[]>([
    { id: "conv-1", title: "Product Questions", preview: "Hi there! 👋 I’m your AI assistant.", time: "Yesterday" },
    { id: "conv-2", title: "Internship Query", preview: "How can I get started?", time: "10:30 AM" },
    { id: "conv-3", title: "Support Request", preview: "Need help with the demo.", time: "9:15 AM" },
  ]);

  const activeConversationTitle = useMemo(() => {
    const active = conversations.find((item) => item.id === conversationId);
    return active?.title ?? "AI Assistant";
  }, [conversationId, conversations]);

  const startConversation = (initialText?: string) => {
    if (!hasStarted) {
      setHasStarted(true);
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          sender: "bot",
          text: "Hi there! 👋 I’m your AI assistant. How can I help today?",
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        },
      ]);
    }

    if (initialText) {
      handleSendMessage(initialText, true);
    }
  };

  const handleSendMessage = (text: string, skipIntro = false) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!hasStarted && !skipIntro) {
      setHasStarted(true);
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };

    setMessages((prev) => (prev.length === 0 ? [userMessage] : [...prev, userMessage]));
    setIsTyping(true);

    window.setTimeout(() => {
      const lowerText = trimmed.toLowerCase();
      let response = DEFAULT_RESPONSE;

      for (const item of BOT_RESPONSES) {
        if (item.keywords.some((keyword) => lowerText.includes(keyword))) {
          response = item.response;
          break;
        }
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 900);
  };

  const handleClear = () => {
    setMessages([]);
    setHasStarted(false);
    setIsTyping(false);
  };

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    setConversationId(newId);
    setMessages([]);
    setHasStarted(false);
    setConversations((prev) => [{ id: newId, title: "New Conversation", preview: "A fresh conversation is ready.", time: "Now" }, ...prev]);
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0d9488] text-white shadow-xl shadow-[#0d9488]/25 transition-all duration-300 hover:scale-105 hover:bg-[#0b7a6f] active:scale-95 ${
          isOpen ? "rotate-90" : "animate-pulse"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <span className="absolute inset-0 rounded-full bg-[#0d9488]/20 opacity-0 transition-all duration-300 group-hover:opacity-100" />
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <div
        className={`fixed bottom-16 right-3 origin-bottom-right transition-all duration-300 sm:bottom-20 sm:right-6 ${
          isOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          hasStarted={hasStarted}
          onSendMessage={handleSendMessage}
          onClose={() => setIsOpen(false)}
          onClear={handleClear}
          conversations={conversations}
          onNewChat={handleNewChat}
          onStartConversation={() => startConversation()}
          onSelectSuggestion={(prompt) => startConversation(prompt)}
          activeConversationTitle={activeConversationTitle}
          activeConversationId={conversationId}
          onSelectConversation={(id) => setConversationId(id)}
          onDeleteConversation={(id) => setConversations((prev) => prev.filter((item) => item.id !== id))}
        />
      </div>
    </div>
  );
}
