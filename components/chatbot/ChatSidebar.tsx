"use client";

import React, { useMemo, useState } from "react";
import { Plus, Search, Sparkles } from "lucide-react";
import ChatHistoryItem from "./ChatHistoryItem";

interface Conversation {
  id: string;
  title: string;
  preview: string;
  time: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  activeConversationId: string;
}

export default function ChatSidebar({
  conversations,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  activeConversationId,
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const query = search.toLowerCase();
    return conversations.filter((item) => item.title.toLowerCase().includes(query) || item.preview.toLowerCase().includes(query));
  }, [conversations, search]);

  return (
    <aside className="hidden h-full w-[250px] flex-col border-r border-gray-200 bg-white/80 p-3 backdrop-blur-sm lg:flex">
      <button
        type="button"
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 rounded-2xl bg-[#0d9488] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0d9488]/20 transition-all duration-300 hover:scale-[1.01] hover:bg-[#0b7a6f]"
      >
        <Plus size={16} />
        New Chat
      </button>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-2">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
            <Sparkles size={16} className="mx-auto mb-2 text-[#0d9488]" />
            No conversations found
          </div>
        ) : null}

        {filteredConversations.map((conversation) => (
          <div key={conversation.id} className="w-full text-left">
            <ChatHistoryItem
              title={conversation.title}
              preview={conversation.preview}
              time={conversation.time}
              onDelete={() => onDeleteConversation(conversation.id)}
              onSelect={() => onSelectConversation(conversation.id)}
              active={conversation.id === activeConversationId}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}
