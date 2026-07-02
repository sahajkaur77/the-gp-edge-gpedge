"use client";

import React from "react";
import { Clock3 } from "lucide-react";

interface HistoryTimelineGroupProps {
  title: string;
  children: React.ReactNode;
}

export default function HistoryTimelineGroup({ title, children }: HistoryTimelineGroupProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        <Clock3 size={12} className="text-emerald-500" />
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
