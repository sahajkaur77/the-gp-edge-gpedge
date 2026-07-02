"use client";

import React from "react";
import { Archive, Heart, Pin, Trash2 } from "lucide-react";

interface ChatHistoryItemProps {
  title: string;
  preview: string;
  time: string;
  lastActive: string;
  folder: string;
  category: string;
  pinned?: boolean;
  favorite?: boolean;
  onDelete: () => void;
  onSelect: () => void;
  active?: boolean;
}

export default function ChatHistoryItem({
  title,
  preview,
  time,
  lastActive,
  folder,
  category,
  pinned,
  favorite,
  onDelete,
  onSelect,
  active,
}: ChatHistoryItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={`group flex cursor-pointer items-start justify-between rounded-[20px] border px-3 py-3 transition-all duration-300 ${active ? "border-emerald-200/80 bg-emerald-50/80 shadow-sm" : "border-slate-200/80 bg-white/80 hover:border-emerald-200 hover:bg-slate-50"}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {pinned ? <Pin size={12} className="text-emerald-600" /> : null}
          {favorite ? <Heart size={12} className="text-rose-500" /> : null}
          <p className="truncate text-sm font-medium text-slate-900">{title}</p>
        </div>
        <p className="mt-1 truncate text-xs text-slate-500">{preview}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="rounded-full bg-slate-100 px-2 py-0.5">{folder}</span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">{category}</span>
          <span>{time}</span>
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">{lastActive}</p>
      </div>

      <div className="ml-2 flex flex-col gap-1.5">
        <button
          type="button"
          className="rounded-full p-1.5 text-slate-400 transition-all duration-300 hover:bg-white hover:text-emerald-600"
          aria-label={`Archive conversation ${title}`}
        >
          <Archive size={14} />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          className="rounded-full p-1.5 text-slate-400 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:text-red-500"
          aria-label={`Delete conversation ${title}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
