"use client";

import React from "react";
import { Trash2 } from "lucide-react";

interface ChatHistoryItemProps {
  title: string;
  preview: string;
  time: string;
  onDelete: () => void;
  onSelect: () => void;
  active?: boolean;
}

export default function ChatHistoryItem({ title, preview, time, onDelete, onSelect, active }: ChatHistoryItemProps) {
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
      className={`group flex cursor-pointer items-start justify-between rounded-2xl border px-3 py-3 transition-all duration-300 ${active ? "border-[#0d9488]/30 bg-[#0d9488]/10" : "border-gray-200 bg-white hover:border-[#0d9488]/20 hover:bg-gray-50"}`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{title}</p>
        <p className="mt-1 truncate text-xs text-gray-500">{preview}</p>
        <p className="mt-1 text-[11px] text-gray-400">{time}</p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            onDelete();
          }
        }}
        className="ml-2 rounded-full p-1.5 text-gray-400 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-gray-100 hover:text-red-500"
        aria-label={`Delete conversation ${title}`}
      >
        <Trash2 size={14} />
      </div>
    </div>
  );
}
