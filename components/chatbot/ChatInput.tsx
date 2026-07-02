"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import FileAttachment, { AttachmentFile } from "./FileAttachment";
import VoiceRecorder from "./VoiceRecorder";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<AttachmentFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setText("");
    setAttachment(null);
  };

  return (
    <div className="space-y-3">
      {attachment ? (
        <div className="rounded-[20px] border border-emerald-200/70 bg-emerald-50/80 px-3 py-2 text-sm text-slate-700 shadow-sm">
          <p className="font-medium text-emerald-700">Attachment ready</p>
          <p className="truncate">{attachment.name}</p>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-[24px] border border-slate-200/80 bg-white/90 p-2 shadow-[0_16px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 focus-within:border-emerald-400 focus-within:shadow-[0_0_0_4px_rgba(13,148,136,0.15)]"
      >
        <FileAttachment attachment={attachment} onAttachmentChange={setAttachment} disabled={disabled} />

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
          disabled={disabled}
          placeholder={disabled ? "Assistant is typing..." : "Ask anything..."}
          className="h-11 flex-1 bg-transparent px-2 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-0 disabled:cursor-not-allowed"
        />

        <VoiceRecorder
          onTranscript={(value) => setText((prev) => (prev ? `${prev} ${value}` : value))}
          disabled={disabled}
        />

        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
            text.trim() && !disabled
              ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 hover:shadow-emerald-500/30 active:scale-95"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>

      <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
        <span>Press Enter to send</span>
        <span className="flex items-center gap-1">
          <Sparkles size={12} />
          AI responses are simulated
        </span>
      </div>
    </div>
  );
}
