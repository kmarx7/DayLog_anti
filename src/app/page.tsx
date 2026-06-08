"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import SettingsModal from "@/components/SettingsModal";
import AnalyzeForm from "@/components/AnalyzeForm";
import ResultDisplay from "@/components/ResultDisplay";
import LogCard from "@/components/LogCard";
import { ProjectLog } from "@/types";
import { getProjectLogs, saveProjectLog, deleteProjectLog } from "@/lib/storage";
import { Sparkles, BookOpen, Clock, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<any | null>(null);
  const [recentLogs, setRecentLogs] = useState<ProjectLog[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Initial fetch of logs
    setRecentLogs(getProjectLogs().slice(0, 3));
  }, []);

  const handleAnalysisStart = () => {
    setAnalyzedData(null);
    setHasStarted(true);
  };

  const handleAnalysisSuccess = (data: any) => {
    setAnalyzedData(data);
  };

  const handleAnalysisError = (err: string) => {
    setHasStarted(false);
  };

  const handleSaveLog = (finalLog: ProjectLog) => {
    saveProjectLog(finalLog);
    // Refresh list
    setRecentLogs(getProjectLogs().slice(0, 3));
    // Reset view
    setAnalyzedData(null);
    setHasStarted(false);
  };

  const handleCancelAnalysis = () => {
    setAnalyzedData(null);
    setHasStarted(false);
  };

  const handleDeleteLog = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("정말로 이 프로젝트 기록을 삭제하시겠습니까?")) {
      deleteProjectLog(id);
      setRecentLogs(getProjectLogs().slice(0, 3));
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#080a10]">
      {/* Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Content container */}
      <main className="flex-grow mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Area */}
        <section className="text-center space-y-4 max-w-2xl mx-auto py-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs text-violet-400 font-semibold animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI 기반 자동 분석 생성기</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
            AI 프로젝트 자동 로그북
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            GitHub 주소와 배포 URL만 넣으면 <br className="sm:hidden" />
            오늘 만든 프로젝트가 자동으로 기록됩니다.
          </p>
        </section>

        {/* Dynamic form / Result section */}
        <section className="max-w-3xl mx-auto">
          {analyzedData ? (
            <ResultDisplay
              logData={analyzedData}
              onSave={handleSaveLog}
              onCancel={handleCancelAnalysis}
            />
          ) : (
            <div className="space-y-6">
              <AnalyzeForm
                onAnalysisStart={handleAnalysisStart}
                onAnalysisSuccess={handleAnalysisSuccess}
                onAnalysisError={handleAnalysisError}
              />
              {!hasStarted && (
                <div className="flex items-center gap-2 rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 text-slate-450 justify-center">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-violet-400" />
                  <p className="text-[11px]">
                    API 키를 입력하지 않아도 <strong>Mock 분석 모드</strong>로 프로젝트를 즉시 분석하고 저장해 볼 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Recent logs section */}
        {!analyzedData && !hasStarted && (
          <section className="space-y-6 border-t border-white/[0.06] pt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-violet-400" />
                <h2 className="text-base font-bold text-white tracking-tight">
                  최근 기록한 프로젝트 로그
                </h2>
              </div>

              {recentLogs.length > 0 && (
                <Link
                  href="/logs"
                  className="flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300 transition"
                >
                  <span>전체 로그북 보기</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {recentLogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentLogs.map((log) => (
                  <LogCard key={log.id} log={log} onDelete={handleDeleteLog} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] text-slate-500">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xs font-bold text-slate-300">최근 생성된 로그가 없습니다</h3>
                <p className="mt-1 text-[11px] text-slate-500 max-w-xs leading-relaxed">
                  상단의 입력 폼에 GitHub 주소와 배포 URL을 입력해 첫 번째 프로젝트 로그를 자동으로 기록해 보세요.
                </p>
              </div>
            )}
          </section>
        )}
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
