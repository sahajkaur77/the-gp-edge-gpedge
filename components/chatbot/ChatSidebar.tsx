"use client";

import React, { useMemo, useState } from "react";
import { Archive, ChevronDown, ChevronRight, Clock3, FolderOpen, Heart, Pin, Plus, Search, Sparkles, Star, Tag } from "lucide-react";
import ChatHistoryItem from "./ChatHistoryItem";
import HistoryTimelineGroup from "./HistoryTimelineGroup";
import SidebarSection from "./SidebarSection";
import { ConversationSummary } from "./chatbotTypes";

interface ChatSidebarProps {
  conversations: ConversationSummary[];
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
  const [sortBy, setSortBy] = useState<"date" | "recent">("date");
  const [collapsedSections, setCollapsedSections] = useState({ folders: false, activity: false, history: false });

  const filteredConversations = useMemo(() => {
    const query = search.toLowerCase();

    return conversations
      .filter((item) => !item.archived)
      .filter((item) => item.title.toLowerCase().includes(query) || item.preview.toLowerCase().includes(query) || item.folder.toLowerCase().includes(query) || item.category.toLowerCase().includes(query))
      .sort((a, b) => {
        if (sortBy === "recent") {
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        }
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      })
      .map((item) => ({ ...item }));
  }, [conversations, search, sortBy]);

  const pinnedConversations = filteredConversations.filter((item) => item.pinned);
  const favoriteConversations = filteredConversations.filter((item) => item.favorite && !item.pinned);
  const regularConversations = filteredConversations.filter((item) => !item.pinned && !item.favorite);

  const groupedConversations = useMemo(() => {
    const groups: Record<string, ConversationSummary[]> = {
      Today: [],
      Yesterday: [],
      "Last Week": [],
      "Last Month": [],
    };

    regularConversations.forEach((conversation) => {
      const date = new Date(conversation.lastActive);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) groups.Today.push(conversation);
      else if (diffDays <= 2) groups.Yesterday.push(conversation);
      else if (diffDays <= 7) groups["Last Week"].push(conversation);
      else groups["Last Month"].push(conversation);
    });

    return groups;
  }, [regularConversations]);

  const toggleSection = (key: "folders" | "activity" | "history") => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderConversationList = (items: ConversationSummary[]) => (
    <div className="space-y-2">
      {items.map((conversation) => (
        <div key={conversation.id} className="w-full text-left">
          <ChatHistoryItem
            title={conversation.title}
            preview={conversation.preview}
            time={conversation.time}
            lastActive={conversation.lastActive}
            folder={conversation.folder}
            category={conversation.category}
            pinned={conversation.pinned}
            favorite={conversation.favorite}
            onDelete={() => onDeleteConversation(conversation.id)}
            onSelect={() => onSelectConversation(conversation.id)}
            active={conversation.id === activeConversationId}
          />
        </div>
      ))}
    </div>
  );

  return (
    <aside className="hidden h-full min-h-0 w-[320px] flex-col border-r border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.95)_0%,_rgba(248,255,254,0.95)_100%)] p-3 backdrop-blur-xl transition-all duration-500 lg:flex">
      <div className="rounded-[24px] border border-emerald-100/80 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-3 text-white shadow-[0_18px_45px_rgba(13,148,136,0.25)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles size={16} />
            AI Workspace
          </div>
          <div className="rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.24em]">
            Pro
          </div>
        </div>
        <p className="mt-1 text-sm text-white/80">Premium conversations, instantly accessible.</p>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="mt-3 flex items-center justify-center gap-2 rounded-[20px] bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
      >
        <Plus size={16} className="text-emerald-600" />
        New Chat
      </button>

      <div className="mt-4 rounded-[20px] border border-slate-200/80 bg-white/80 p-2 shadow-sm">
        <div className="flex items-center gap-2 rounded-[16px] border border-slate-200/80 bg-slate-50 px-3 py-2">
          <Search size={14} className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search history"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-[16px] border border-slate-200/80 bg-white/70 px-3 py-2 text-xs text-slate-500">
        <span className="font-medium">Sort by</span>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as "date" | "recent")}
          className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 outline-none"
        >
          <option value="date">Date</option>
          <option value="recent">Recent</option>
        </select>
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1 chat-scrollbar">
        <SidebarSection
          title="Quick views"
          icon={<FolderOpen size={12} />}
          action={<button type="button" onClick={() => toggleSection("folders")} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
            {collapsedSections.folders ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>}
        >
          {!collapsedSections.folders ? (
            <div className="space-y-2">
              {[
                { label: "Pinned", value: pinnedConversations.length, icon: <Pin size={12} className="text-emerald-600" /> },
                { label: "Favorites", value: favoriteConversations.length, icon: <Heart size={12} className="text-rose-500" /> },
                { label: "Archived", value: conversations.filter((item) => item.archived).length, icon: <Archive size={12} className="text-slate-500" /> },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-[16px] border border-slate-200/70 bg-slate-50/70 px-3 py-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </div>
                  <span className="font-semibold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          ) : null}
        </SidebarSection>

        <SidebarSection
          title="Recent activity"
          icon={<Clock3 size={12} />}
          action={<button type="button" onClick={() => toggleSection("activity")} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
            {collapsedSections.activity ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>}
        >
          {!collapsedSections.activity ? (
            <div className="space-y-2">
              {filteredConversations.slice(0, 3).map((conversation) => (
                <div key={conversation.id} className="rounded-[16px] border border-slate-200/70 bg-slate-50/70 px-3 py-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-slate-800">{conversation.title}</span>
                    <span className="text-[11px] text-slate-400">{conversation.time}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">{conversation.preview}</p>
                </div>
              ))}
            </div>
          ) : null}
        </SidebarSection>

        <SidebarSection
          title="History"
          icon={<Tag size={12} />}
          action={<button type="button" onClick={() => toggleSection("history")} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
            {collapsedSections.history ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>}
        >
          {!collapsedSections.history ? (
            filteredConversations.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-slate-200/80 bg-white/70 p-4 text-center text-sm text-slate-500">
                <Sparkles size={16} className="mx-auto mb-2 text-emerald-500" />
                No conversations found
              </div>
            ) : (
              <div className="space-y-3">
                {pinnedConversations.length > 0 ? (
                  <HistoryTimelineGroup title="Pinned">
                    {renderConversationList(pinnedConversations)}
                  </HistoryTimelineGroup>
                ) : null}

                {favoriteConversations.length > 0 ? (
                  <HistoryTimelineGroup title="Favorites">
                    {renderConversationList(favoriteConversations)}
                  </HistoryTimelineGroup>
                ) : null}

                {Object.entries(groupedConversations).map(([label, items]) => (
                  items.length > 0 ? (
                    <HistoryTimelineGroup key={label} title={label}>
                      {renderConversationList(items)}
                    </HistoryTimelineGroup>
                  ) : null
                ))}
              </div>
            )
          ) : null}
        </SidebarSection>
      </div>
    </aside>
  );
}
