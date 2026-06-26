"use client";

import React, { useEffect, useRef, useState } from "react";
import { FileText, Image as ImageIcon, Paperclip, X } from "lucide-react";

export interface AttachmentFile {
  name: string;
  type: string;
  previewUrl?: string;
}

interface FileAttachmentProps {
  attachment: AttachmentFile | null;
  onAttachmentChange: (attachment: AttachmentFile | null) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg";

export default function FileAttachment({ attachment, onAttachmentChange, disabled }: FileAttachmentProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!attachment?.previewUrl) {
      setPreviewUrl(undefined);
      return;
    }

    setPreviewUrl(attachment.previewUrl);
    return () => {
      if (attachment.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
    };
  }, [attachment]);

  const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    onAttachmentChange({
      name: file.name,
      type: file.type,
      previewUrl,
    });

    event.target.value = "";
  };

  const handleRemove = () => {
    if (attachment?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
    onAttachmentChange(null);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        title="Attach File"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0d9488] shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#0d9488] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Paperclip size={16} />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleSelection}
        className="hidden"
      />

      {attachment ? (
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
          {attachment.type.startsWith("image/") && previewUrl ? (
            <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
              <img src={previewUrl} alt={attachment.name} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d9488]/10 text-[#0d9488]">
              {attachment.type.includes("pdf") ? <FileText size={14} /> : <ImageIcon size={14} />}
            </div>
          )}

          <span className="max-w-[120px] truncate text-sm text-gray-700">{attachment.name}</span>

          <button
            type="button"
            onClick={handleRemove}
            className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={13} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
