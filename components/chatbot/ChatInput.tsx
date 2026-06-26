"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
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
    <div className="space-y-2">
      {attachment ? (
        <div className="rounded-2xl border border-[#0d9488]/20 bg-[#0d9488]/5 px-3 py-2 text-sm text-gray-700">
          <p className="font-medium text-[#0d9488]">Attachment ready</p>
          <p className="truncate">{attachment.name}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-sm transition-all duration-300 focus-within:border-[#0d9488] focus-within:shadow-[0_0_0_3px_rgba(13,148,136,0.15)]">
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
          className="h-11 flex-1 bg-transparent px-2 text-sm text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed"
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
              ? "bg-[#0d9488] text-white shadow-md shadow-[#0d9488]/20 hover:scale-105 hover:bg-[#0b7a6f] active:scale-95"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
