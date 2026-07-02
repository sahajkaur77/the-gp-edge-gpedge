"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, Menu, Plus, Sparkles, X } from "lucide-react";
import ChatInput from "./ChatInput";
import ChatMessage, { Message } from "./ChatMessage";
import ChatSidebar from "./ChatSidebar";
import WelcomeScreen from "./WelcomeScreen";

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  hasStarted: boolean;
  onSendMessage: (text: string) => void;
  onClose: () => void;
  onClear: () => void;
  conversations: Array<{ id: string; title: string; preview: string; time: string }>;
  onNewChat: () => void;
  onStartConversation: () => void;
  onSelectSuggestion: (prompt: string) => void;
  activeConversationTitle: string;
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export default function ChatWindow({
  messages,
  isTyping,
  onSendMessage,
  onClose,
  onClear,
  conversations,
  onNewChat,
  onStartConversation,
  onSelectSuggestion,
  hasStarted,
  activeConversationTitle,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
}: ChatWindowProps) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = messageContainerRef.current;
    if (!container) return;

    container.scrollTo({ top: container.scrollHeight, behavior });
  };

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 140;
      setShowScrollButton(!nearBottom);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages, isTyping]);

  useEffect(() => {
    const timer = window.setTimeout(() => scrollToBottom("smooth"), 80);
    return () => window.clearTimeout(timer);
  }, [messages, isTyping]);

  return (
    <div className="animate-[fadeIn_0.3s_ease-out] flex h-full w-full min-h-[100dvh] flex-col overflow-hidden rounded-none border-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(135deg,_#f8fffe_0%,_#ffffff_55%,_#f0fdfa_100%)] shadow-none backdrop-blur-sm sm:min-h-0 sm:flex-row sm:rounded-[28px] sm:border sm:border-white/70 sm:shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
      <div className="hidden h-full sm:block">
        <ChatSidebar
          conversations={conversations}
          onNewChat={onNewChat}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
          activeConversationId={activeConversationId}
        />
      </div>

      {sidebarOpen ? (
        <div className="absolute inset-y-0 left-0 z-20 w-[82vw] max-w-[290px] bg-white/95 shadow-2xl backdrop-blur-xl sm:hidden">
          <ChatSidebar
            conversations={conversations}
            onNewChat={onNewChat}
            onSelectConversation={onSelectConversation}
            onDeleteConversation={onDeleteConversation}
            activeConversationId={activeConversationId}
          />
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-shrink-0 sticky top-0 z-20 flex items-center justify-between border-b border-white/70 bg-white/70 px-4 py-3 text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:px-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-600 transition-all duration-300 hover:scale-105 hover:bg-emerald-50 hover:text-emerald-600 sm:hidden"
            >
              <Menu size={16} />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20">
              <Bot size={17} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900">{activeConversationTitle}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Online
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNewChat}
              className="hidden rounded-full border border-slate-200/80 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:scale-105 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 sm:flex"
            >
              <span className="flex items-center gap-2">
                <Plus size={14} />
                New Chat
              </span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-full px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-all duration-300 hover:scale-105 hover:bg-slate-100"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-600 transition-all duration-300 hover:scale-105 hover:bg-slate-100"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          ref={messageContainerRef}
          className="chat-scrollbar relative min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/90 via-white to-slate-50/90 px-3 py-3 sm:px-5 sm:py-4"
        >
          {!hasStarted ? (
            <div className="animate-[fadeIn_0.3s_ease-out] h-full">
              <WelcomeScreen onStartConversation={onStartConversation} onSelectSuggestion={onSelectSuggestion} />
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className="animate-[fadeIn_0.25s_ease-out]">
                  <ChatMessage message={message} />
                </div>
              ))}

              {isTyping ? (
                <div className="mb-4 flex justify-start">
                  <div className="max-w-[85%] rounded-[24px] border border-slate-200/80 bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500" />
                        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "0.15s" }} />
                        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "0.3s" }} />
                      </div>
                      <span className="text-sm font-medium text-slate-500">Thinking…</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}

          {showScrollButton ? (
            <button
              type="button"
              onClick={() => scrollToBottom("smooth")}
              className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-600 shadow-lg shadow-slate-200/80 transition-all duration-300 hover:scale-105 hover:border-emerald-300 hover:text-emerald-600 sm:bottom-6 sm:right-6"
              aria-label="Scroll to latest messages"
            >
              <ChevronDown size={18} />
            </button>
          ) : null}

          <div ref={scrollAnchorRef} />
        </div>

        <div className="flex-shrink-0 border-t border-slate-200/70 bg-white/85 px-3 py-3 backdrop-blur-xl sm:px-4">
          {hasStarted ? <ChatInput onSendMessage={onSendMessage} disabled={isTyping} /> : null}
        </div>
      </div>
    </div>
  );
}
