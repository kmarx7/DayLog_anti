"use client";

import React, { useState } from "react";
import { Globe, FileText, Sparkles, Loader2, AlertCircle } from "lucide-react";
import Github from "@/components/GithubIcon";
import { getApiKeys } from "@/lib/storage";

type AnalyzeFormProps = {
  onAnalysisSuccess: (data: any) => void;
  onAnalysisStart: () => void;
  onAnalysisError: (err: string) => void;
};

type LoadingStep = "idle" | "github" | "deploy" | "ai" | "done";

export default function AnalyzeForm({
  onAnalysisSuccess,
  onAnalysisStart,
  onAnalysisError,
}: AnalyzeFormProps) {
  const [githubUrl, setGithubUrl] = useState("");
  const [deployUrl, setDeployUrl] = useState("");
  const [userMemo, setUserMemo] = useState("");
  const [status, setStatus] = useState<LoadingStep>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!githubUrl.trim()) {
      setErrorMsg("GitHub Repository URL을 입력해 주세요.");
      return;
    }
    if (!deployUrl.trim()) {
      setErrorMsg("최종 배포 URL을 입력해 주세요.");
      return;
    }

    try {
      setStatus("github");
      onAnalysisStart();

      const apiKeys = getApiKeys();

      // Step animations
      const nextStep = (step: LoadingStep, delay: number) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            setStatus(step);
            resolve();
          }, delay);
        });
      };

      // Simulated steps just for smoother visual transition
      const apiPromise = fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUrl: githubUrl.trim(),
          deployUrl: deployUrl.trim(),
          userMemo: userMemo.trim(),
          apiKeys,
        }),
      });

      await nextStep("deploy", 1200);
      await nextStep("ai", 1200);

      const response = await apiPromise;
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "분석 과정 중 오류가 발생했습니다.");
      }

      setStatus("done");
      setTimeout(() => {
        onAnalysisSuccess({
          ...data,
          githubUrl: githubUrl.trim(),
          deployUrl: deployUrl.trim(),
          userMemo: userMemo.trim(),
        });
        setStatus("idle");
      }, 500);

    } catch (err: any) {
      console.error(err);
      setStatus("idle");
      const errMsg = err.message || "분석에 실패했습니다. 입력한 정보와 API 설정을 다시 확인해 주세요.";
      setErrorMsg(errMsg);
      onAnalysisError(errMsg);
    }
  };

  const isAnalyzing = status !== "idle" && status !== "done";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c101b]/60 backdrop-blur-xl p-6 md:p-8 shadow-xl">
      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#080a10]/90 p-6 text-center animate-fadeIn">
          <div className="relative flex h-20 w-20 items-center justify-center">
            {/* Spinning gradient ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/[0.04]" />
            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-emerald-500 animate-spin" />
            <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" />
          </div>

          <h3 className="mt-6 text-lg font-bold text-white tracking-tight">AI 분석 진행 중</h3>
          <p className="mt-1.5 text-xs text-slate-400 max-w-xs leading-relaxed">
            GitHub 코드와 배포 사이트를 읽고 있습니다. 잠시만 기다려 주세요.
          </p>

          {/* Stepper Status UI */}
          <div className="mt-8 w-full max-w-xs space-y-3">
            {[
              { id: "github", label: "GitHub 저장소 정보 수집 중..." },
              { id: "deploy", label: "배포 사이트 HTML 구조 크롤링 중..." },
              { id: "ai", label: "AI 프로젝트 기록 보고서 생성 중..." },
            ].map((step, idx) => {
              const stepKeys: LoadingStep[] = ["github", "deploy", "ai"];
              const currentIdx = stepKeys.indexOf(status);
              const targetIdx = stepKeys.indexOf(step.id as LoadingStep);
              
              let stepStatus: "wait" | "active" | "done" = "wait";
              if (currentIdx > targetIdx) stepStatus = "done";
              else if (currentIdx === targetIdx) stepStatus = "active";

              return (
                <div key={step.id} className="flex items-center gap-3 text-left">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition duration-300 ${
                    stepStatus === "done" 
                      ? "bg-emerald-500 text-white" 
                      : stepStatus === "active"
                      ? "bg-violet-500 text-white animate-pulse"
                      : "bg-white/[0.06] text-slate-500"
                  }`}>
                    {stepStatus === "done" ? "✓" : idx + 1}
                  </div>
                  <span className={`text-xs transition duration-300 ${
                    stepStatus === "active" 
                      ? "text-white font-medium" 
                      : stepStatus === "done"
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* GitHub URL */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-350">
            <Github className="h-4 w-4 text-violet-400" />
            <span>GitHub Repository URL <span className="text-violet-400">*</span></span>
          </label>
          <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.01] glow-focus focus-within:border-violet-500/50 transition-all duration-300">
            <input
              type="text"
              required
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo-name"
              className="w-full bg-transparent py-3.5 pl-4 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Deploy URL */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-350">
            <Globe className="h-4 w-4 text-emerald-450" />
            <span>Final Deploy URL <span className="text-violet-400">*</span></span>
          </label>
          <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.01] glow-focus focus-within:border-violet-500/50 transition-all duration-300">
            <input
              type="text"
              required
              value={deployUrl}
              onChange={(e) => setDeployUrl(e.target.value)}
              placeholder="https://your-project.vercel.app"
              className="w-full bg-transparent py-3.5 pl-4 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* User Memo */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-350">
              <FileText className="h-4 w-4 text-slate-400" />
              <span>오늘의 한 줄 메모 (선택)</span>
            </label>
            <span className="text-[10px] text-slate-500 font-semibold">{userMemo.length} / 150자</span>
          </div>
          <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.01] glow-focus focus-within:border-violet-500/50 transition-all duration-300">
            <textarea
              value={userMemo}
              maxLength={150}
              onChange={(e) => setUserMemo(e.target.value)}
              placeholder="오늘의 작업 내용, 특별히 신경 쓴 점, 또는 개발 중 느낀 점을 간단히 적어보세요."
              rows={3}
              className="w-full bg-transparent py-3.5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-red-400 animate-shake">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed font-semibold">{errorMsg}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-indigo-650 to-violet-700 py-4 text-sm font-bold text-white shadow-lg shadow-violet-500/10 transition-all duration-300 hover:shadow-violet-500/20 active:scale-[0.99] glow-effect"
        >
          <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse group-hover:scale-110 duration-250" />
          <span>자동 기록 생성하기</span>
        </button>
      </form>
    </div>
  );
}
