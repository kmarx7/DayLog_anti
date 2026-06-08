"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Settings, Home, Code2 } from "lucide-react";

type HeaderProps = {
  onOpenSettings: () => void;
};

export default function Header({ onOpenSettings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#080a10]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 group transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-emerald-500 text-white shadow-md shadow-violet-500/10 group-hover:scale-105 duration-200">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  AI Project Logbook
                </span>
                <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                  자동 로그북
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">홈</span>
            </Link>
            
            <Link
              href="/logs"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">로그북</span>
            </Link>

            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white active:scale-95"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">API 설정</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
