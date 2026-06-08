"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import SettingsModal from "@/components/SettingsModal";
import LogCard from "@/components/LogCard";
import { ProjectLog } from "@/types";
import { getProjectLogs, deleteProjectLog } from "@/lib/storage";
import { BookOpen, Search, Filter, RefreshCw } from "lucide-react";

export default function LogsPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [logs, setLogs] = useState<ProjectLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  useEffect(() => {
    setLogs(getProjectLogs());
  }, []);

  const handleDeleteLog = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("정말로 이 프로젝트 기록을 삭제하시겠습니까?")) {
      deleteProjectLog(id);
      setLogs(getProjectLogs());
    }
  };

  // Get all unique tech stack items for filtering
  const allTechStacks = Array.from(
    new Set(logs.flatMap((log) => log.techStack || []))
  ).sort();

  // Filter logs based on search and selected tech stack
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.userMemo && log.userMemo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTech = selectedTech
      ? log.techStack.some((t) => t.toLowerCase() === selectedTech.toLowerCase())
      : true;

    return matchesSearch && matchesTech;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTech(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080a10]">
      {/* Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Container */}
      <main className="flex-grow mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Page title */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              프로젝트 로그북
            </h1>
            <p className="mt-1.5 text-xs text-slate-455">
              지금까지 기록한 AI 프로젝트들의 누적 보관함입니다.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-semibold bg-white/[0.02] border border-white/[0.06] px-3.5 py-2 rounded-xl self-start">
            총 <span className="text-violet-400 font-bold">{logs.length}개</span>의 프로젝트
          </div>
        </section>

        {/* Filter / Search Controls */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0c101b]/30 border border-white/[0.06] p-4 rounded-2xl">
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="프로젝트명, 설명, 메모 검색..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition duration-150"
            />
          </div>

          {/* Tech Select */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            <select
              value={selectedTech || ""}
              onChange={(e) => setSelectedTech(e.target.value || null)}
              className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0c101b] py-2.5 pl-10 pr-8 text-xs text-slate-300 focus:border-violet-500 focus:outline-none transition duration-150"
            >
              <option value="">모든 기술 스택</option>
              {allTechStacks.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-xs font-bold text-slate-300 hover:bg-white/[0.08] hover:text-white transition active:scale-95"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>필터 초기화</span>
          </button>
        </section>

        {/* Logs Grid */}
        <section>
          {filteredLogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredLogs.map((log) => (
                <LogCard key={log.id} log={log} onDelete={handleDeleteLog} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] text-slate-500">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-350">일치하는 프로젝트 로그가 없습니다</h3>
              <p className="mt-1.5 text-xs text-slate-500 max-w-xs leading-relaxed">
                검색어를 변경하거나 필터를 초기화해 보세요.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] bg-[#06080d]/60 py-6 text-center text-xs text-slate-500 mt-12">
        <p>© {new Date().getFullYear()} AI Project Logbook. All rights reserved.</p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
