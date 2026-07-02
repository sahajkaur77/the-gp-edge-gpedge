"use client";

import React from "react";
import { Bot, User } from "lucide-react";

interface ChatAvatarProps {
  type: "user" | "bot";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ChatAvatar({ type, className = "", size = "md" }: ChatAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const baseClasses = `flex shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-all duration-300 ${sizeClasses[size]} ${className}`;

  return type === "user" ? (
    <div className={`${baseClasses} border-emerald-200/70 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white`}>
      <User size={size === "lg" ? 18 : size === "md" ? 16 : 13} />
    </div>
  ) : (
    <div className={`${baseClasses} border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-600`}>
      <Bot size={size === "lg" ? 18 : size === "md" ? 16 : 13} />
    </div>
  );
}
