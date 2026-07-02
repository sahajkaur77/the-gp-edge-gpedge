"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Sparkles, X } from "lucide-react";
import ChatWindow from "./ChatWindow";
import { Message } from "./ChatMessage";
import { ConversationSummary } from "./chatbotTypes";

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

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState("conv-1");
  const [conversations, setConversations] = useState<ConversationSummary[]>([
    { id: "conv-1", title: "Product Questions", preview: "Hi there! 👋 I’m your AI assistant.", time: "Yesterday", lastActive: "2026-07-01T11:20:08.268Z", folder: "Work", category: "Support", pinned: true, favorite: true },
    { id: "conv-2", title: "Internship Query", preview: "How can I get started?", time: "10:30 AM", lastActive: "2026-06-30T10:30:00.000Z", folder: "Study", category: "Learning", favorite: true },
    { id: "conv-3", title: "Support Request", preview: "Need help with the demo.", time: "9:15 AM", lastActive: "2026-06-24T09:15:00.000Z", folder: "Admin", category: "Help", pinned: false },
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
    setConversations((prev) => [{ id: newId, title: "New Conversation", preview: "A fresh conversation is ready.", time: "Now", lastActive: new Date().toISOString(), folder: "Inbox", category: "New", pinned: false, favorite: false }, ...prev]);
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 sm:bottom-6 sm:right-6">
      <div className="mb-3 flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-sm font-medium text-slate-600 shadow-lg shadow-slate-200/70 backdrop-blur">
        <Sparkles size={14} className="text-emerald-600" />
        Ask AI
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-[0_12px_35px_rgba(13,148,136,0.28)] transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? "rotate-90" : "hover:shadow-[0_12px_35px_rgba(13,148,136,0.42)]"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />

        {!isOpen && <span className="absolute -inset-1 -z-10 animate-pulse-slow rounded-full border-2 border-emerald-400/30" />}

        {isOpen ? <X size={22} className="transition-transform duration-300" /> : <MessageCircle size={22} className="transition-transform duration-300" />}
      </button>

      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="h-full w-full bg-slate-950/20 backdrop-blur-sm sm:p-4">
          <div className="h-full w-full sm:mx-auto sm:h-[92dvh] sm:max-h-[860px] sm:w-[92vw] sm:max-w-[960px]">
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
      </div>
    </div>

  );
}
