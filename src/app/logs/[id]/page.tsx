"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import SettingsModal from "@/components/SettingsModal";
import Toast from "@/components/Toast";
import { ProjectLog } from "@/types";
import { getProjectLogById, updateProjectLog, deleteProjectLog } from "@/lib/storage";
import { 
  ArrowLeft, Globe, Calendar, Edit3, Save, Copy, 
  Trash2, BookOpen, Check, Layers, Cpu, X 
} from "lucide-react";
import Github from "@/components/GithubIcon";

export default function LogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [log, setLog] = useState<ProjectLog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedType, setCopiedType] = useState<"markdown" | null>(null);

  // Toast states
  const [toastMsg, setToastMsg] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  // Edit fields state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [userMemo, setUserMemo] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [uxUiAnalysis, setUxUiAnalysis] = useState("");
  const [improvements, setImprovements] = useState("");

  useEffect(() => {
    if (id) {
      const data = getProjectLogById(id);
      if (data) {
        setLog(data);
        setTitle(data.title);
        setSummary(data.summary);
        setUserMemo(data.userMemo || "");
        setTechStackInput(data.techStack.join(", "));
        setFeaturesInput(data.features.join("\n"));
        setUxUiAnalysis(data.uxUiAnalysis || "");
        setImprovements(data.improvements);
      }
    }
  }, [id]);

  if (!log) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080a10]">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
          <p className="text-slate-400">기록된 앱 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push("/logs")}
            className="mt-4 flex items-center gap-1 text-xs font-bold text-violet-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>목록으로 돌아가기</span>
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    const finalTech = techStackInput.split(",").map((t) => t.trim()).filter(Boolean);
    const finalFeatures = featuresInput.split("\n").map((f) => f.trim()).filter(Boolean);

    const updated: ProjectLog = {
      ...log,
      title,
      summary,
      userMemo,
      techStack: finalTech,
      features: finalFeatures,
      uxUiAnalysis,
      improvements,
    };

    const saved = updateProjectLog(updated);
    setLog(saved);
    setIsEditing(false);
    setToastMsg("앱 정보 수정 사항이 성공적으로 저장되었습니다.");
    setToastOpen(true);
  };

  const handleDelete = () => {
    if (confirm("정말로 이 기록을 보관함에서 삭제하시겠습니까?")) {
      deleteProjectLog(log.id);
      router.push("/logs");
    }
  };

  const handleCopyMarkdown = () => {
    const markdown = `
# 📱 ${title}
> **${summary}**

- **GitHub Repository**: [코드 저장소](${log.githubUrl})
- **Deploy URL**: [실배포 페이지](${log.deployUrl})
- **기록 생성일**: ${log.date}

---

## 🛠️ 1. 사용 기술 스택
${techStackInput.split(",").map((t) => `\`${t.trim()}\``).join(" ")}

## 🌟 2. 주요 구현 기능
${featuresInput.split("\n").map((f) => `- ${f.trim()}`).join("\n")}

---

## 🎨 3. UX/UI 분석 & 피드백
${uxUiAnalysis || "분석 내용 없음."}

## 💡 4. 향후 개선 및 보완할 점
${improvements}

---

## ✏️ 5. 오늘의 메모
> ${userMemo || "기록된 한 줄 소감이 없습니다."}
    `.trim();

    navigator.clipboard.writeText(markdown);
    setCopiedType("markdown");
    setToastMsg("README 마크다운 템플릿이 클립보드에 복사되었습니다.");
    setToastOpen(true);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getTechBadgeStyle = (tech: string) => {
    const t = tech.toLowerCase().trim();
    if (t === "react") return "bg-sky-500/10 border-sky-500/20 text-sky-450";
    if (t === "next.js" || t === "next") return "bg-black border-white/20 text-white";
    if (t === "typescript" || t === "ts") return "bg-blue-500/10 border-blue-500/20 text-blue-400";
    if (t === "tailwindcss" || t === "tailwind") return "bg-teal-500/10 border-teal-500/20 text-teal-400";
    if (t === "firebase") return "bg-amber-500/10 border-amber-500/20 text-amber-500";
    if (t === "supabase") return "bg-emerald-500/10 border-emerald-500/20 text-emerald-450";
    if (t === "javascript" || t === "js") return "bg-yellow-500/10 border-yellow-500/20 text-yellow-500";
    if (t === "node.js" || t === "node") return "bg-green-500/10 border-green-500/20 text-green-400";
    return "bg-white/[0.03] border-white/[0.06] text-slate-350";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080a10]">
      {/* Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Container */}
      <main className="flex-grow mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <button
            onClick={() => router.push("/logs")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>목록으로 돌아가기</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs font-semibold text-slate-350 hover:bg-white/[0.06] hover:text-white transition"
            >
              {copiedType === "markdown" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>Markdown 복사</span>
            </button>

            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-violet-500 transition"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  <span>수정 저장</span>
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  <span>내용 수정</span>
                </>
              )}
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-350 transition"
            >
              <Trash2 className="h-4 w-4" />
              <span>기록 삭제</span>
            </button>
          </div>
        </div>

        {/* Dynamic App Header Panel */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#0c101b]/50 p-6 md:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-extrabold text-white bg-white/[0.01] border border-white/[0.08] rounded-xl px-3 py-1.5 focus:border-violet-500 focus:outline-none w-full max-w-xl"
              />
            ) : (
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {log.title}
              </h1>
            )}

            <span className="flex items-center gap-1.5 text-xs text-slate-450 self-start sm:self-center">
              <Calendar className="h-4 w-4" />
              {log.date}
            </span>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="text-sm text-slate-350 bg-white/[0.01] border border-white/[0.08] rounded-xl px-3 py-1.5 focus:border-violet-500 focus:outline-none w-full"
            />
          ) : (
            <p className="text-sm text-slate-300 font-medium">
              {log.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-450 pt-2 border-t border-white/[0.04]">
            <a
              href={log.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <Github className="h-4 w-4" />
              <span>{log.githubMeta?.owner}/{log.githubMeta?.repoName}</span>
            </a>
            
            <a
              href={log.deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <Globe className="h-4 w-4 text-emerald-450" />
              <span>{log.deployUrl.replace(/^https?:\/\//, "")}</span>
            </a>
          </div>
        </section>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1: App basic notes and technical specs */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c101b]/30 p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
              <Layers className="h-4 w-4" />
              <span>앱 기록 및 기술 정보</span>
            </h2>

            {/* User Memo */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">오늘의 한 줄 메모</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={userMemo}
                  onChange={(e) => setUserMemo(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.01] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500 resize-none"
                />
              ) : (
                <p className="text-xs text-slate-350 leading-relaxed italic">&quot;{userMemo || "작성된 소감이 없습니다."}&quot;</p>
              )}
            </div>

            {/* Tech Stack */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">사용 기술 스택</span>
              {isEditing ? (
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.01] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {log.techStack.map((tech, i) => (
                    <span key={i} className={`rounded border px-2 py-0.5 text-[10px] font-medium ${getTechBadgeStyle(tech)}`}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">주요 기능 명세</span>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.01] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500 resize-none"
                />
              ) : (
                <ul className="list-inside list-disc space-y-1 text-xs text-slate-350">
                  {log.features.map((feat, i) => (
                    <li key={i} className="leading-relaxed">{feat}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Column 2: UX/UI Analysis & Improvements */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c101b]/30 p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-450">
              <Cpu className="h-4 w-4" />
              <span>UX/UI 피드백 및 개선안</span>
            </h2>

            {/* UX/UI Analysis */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">UX/UI 관련 분석</span>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={uxUiAnalysis}
                  onChange={(e) => setUxUiAnalysis(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.01] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500 resize-none"
                />
              ) : (
                <p className="text-xs text-slate-355 leading-relaxed whitespace-pre-wrap">{uxUiAnalysis || "분석 내용 없음."}</p>
              )}
            </div>

            {/* Improvements */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">개선 및 보완할 점</span>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.01] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500 resize-none"
                />
              ) : (
                <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{improvements}</p>
              )}
            </div>
          </div>

        </div>
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

      {/* Toast */}
      <Toast 
        message={toastMsg} 
        isOpen={toastOpen} 
        onClose={() => setToastOpen(false)} 
      />
    </div>
  );
}
