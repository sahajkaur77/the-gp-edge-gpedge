"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot, Menu, Plus, X } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  return (
    <div className="animate-[fadeIn_0.3s_ease-out] flex h-[100dvh] w-[100vw] flex-col overflow-hidden rounded-none border-0 bg-white/95 shadow-none backdrop-blur-sm sm:h-[650px] sm:w-[860px] sm:flex-row sm:rounded-[24px] sm:border sm:border-gray-200 sm:shadow-2xl">
      <div className="hidden sm:block">
        <ChatSidebar
          conversations={conversations}
          onNewChat={onNewChat}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
          activeConversationId={activeConversationId}
        />
      </div>

      {sidebarOpen ? (
        <div className="absolute inset-y-0 left-0 z-20 w-[80vw] max-w-[280px] bg-white shadow-2xl sm:hidden">
          <ChatSidebar
            conversations={conversations}
            onNewChat={onNewChat}
            onSelectConversation={onSelectConversation}
            onDeleteConversation={onDeleteConversation}
            activeConversationId={activeConversationId}
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/20 bg-gradient-to-r from-[#0d9488] via-[#14b8a6] to-[#2dd4bf] px-4 py-3 text-white shadow-lg shadow-[#0d9488]/20 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white/90 transition-all duration-300 hover:scale-105 hover:bg-white/15 sm:hidden"
            >
              <Menu size={16} />
            </button>

            <div className="flex h-10 w-10 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-sm">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{activeConversationTitle}</h3>
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                Online
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNewChat}
              className="hidden rounded-full border border-white/30 bg-white/10 px-3 py-2 text-sm text-white transition-all duration-300 hover:scale-105 hover:bg-white/20 sm:flex"
            >
              <span className="flex items-center gap-2">
                <Plus size={14} />
                New Chat
              </span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-full px-2.5 py-1.5 text-sm text-white/90 transition-all duration-300 hover:scale-105 hover:bg-white/15"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/90 transition-all duration-300 hover:scale-105 hover:bg-white/15"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white px-3 py-3 sm:px-4">
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
                <div className="mb-3 flex justify-start">
                  <div className="rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#0d9488]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#0d9488]" style={{ animationDelay: "0.15s" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#0d9488]" style={{ animationDelay: "0.3s" }} />
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}

          {isTyping ? (
            <div className="mb-3 flex justify-start">
              <div className="rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#0d9488]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#0d9488]" style={{ animationDelay: "0.15s" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#0d9488]" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </div>
          ) : null}

          <div ref={scrollRef} />
        </div>

        <div className="border-t border-gray-200 bg-white/90 p-3 backdrop-blur">
          {hasStarted ? <ChatInput onSendMessage={onSendMessage} disabled={isTyping} /> : null}
        </div>
      </div>
    </div>
  );
}
