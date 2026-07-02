"use client";

import React from "react";

interface SidebarSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  collapsed?: boolean;
}

export default function SidebarSection({ title, icon, children, action, collapsed = false }: SidebarSectionProps) {
  return (
    <section className="rounded-[20px] border border-slate-200/80 bg-white/80 p-2 shadow-sm">
      <div className="mb-2 flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {icon ? <span className="text-emerald-600">{icon}</span> : null}
          {title}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className={collapsed ? "hidden" : "space-y-2"}>{children}</div>
    </section>
  );
}
