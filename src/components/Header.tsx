"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Settings, Home, Code2 } from "lucide-react";

type HeaderProps = {
  onOpenSettings: () => void;
};

export default function Header({ onOpenSettings }: HeaderProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isLogs = pathname.startsWith("/logs");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#080a10]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 group transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-550 to-emerald-500 text-white shadow-md shadow-violet-500/10 group-hover:scale-105 duration-300">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-sm sm:text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-emerald-250 bg-clip-text text-transparent group-hover:from-violet-200 group-hover:to-emerald-300 duration-300">
                  AI Project Logbook
                </span>
                <span className="inline-block sm:ml-2 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full w-fit">
                  자동 로그북
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition duration-200 ${
                isHome 
                  ? "text-white bg-white/[0.04]" 
                  : "text-slate-400 hover:bg-white/[0.02] hover:text-white"
              }`}
            >
              <Home className="h-4.5 w-4.5 shrink-0" />
              <span className="hidden sm:inline">대시보드</span>
              {isHome && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full" />
              )}
            </Link>
            
            <Link
              href="/logs"
              className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition duration-200 ${
                isLogs 
                  ? "text-white bg-white/[0.04]" 
                  : "text-slate-400 hover:bg-white/[0.02] hover:text-white"
              }`}
            >
              <BookOpen className="h-4.5 w-4.5 shrink-0" />
              <span className="hidden sm:inline">로그북 보관함</span>
              {isLogs && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full" />
              )}
            </Link>

            <div className="h-4 w-[1px] bg-white/[0.08] mx-1" />

            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white active:scale-95 glow-effect"
            >
              <Settings className="h-4.5 w-4.5 animate-spin-slow" />
              <span className="hidden sm:inline">API 설정</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
