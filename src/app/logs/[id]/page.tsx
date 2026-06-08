"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import SettingsModal from "@/components/SettingsModal";
import { ProjectLog } from "@/types";
import { getProjectLogById, updateProjectLog, deleteProjectLog } from "@/lib/storage";
import { 
  ArrowLeft, Globe, Calendar, Edit3, Save, Copy, 
  Trash2, BookOpen, Check, Layers, Cpu, Award, RefreshCw 
} from "lucide-react";
import Github from "@/components/GithubIcon";

export default function LogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [log, setLog] = useState<ProjectLog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedType, setCopiedType] = useState<"text" | "markdown" | null>(null);

  // Edit fields state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [purpose, setPurpose] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [implementationSummary, setImplementationSummary] = useState("");
  const [learned, setLearned] = useState("");
  const [difficulties, setDifficulties] = useState("");
  const [improvements, setImprovements] = useState("");
  const [portfolioDescription, setPortfolioDescription] = useState("");
  const [assignmentSummary, setAssignmentSummary] = useState("");
  const [readmeSummary, setReadmeSummary] = useState("");
  const [commitSummary, setCommitSummary] = useState("");
  const [deployAnalysis, setDeployAnalysis] = useState("");

  useEffect(() => {
    if (id) {
      const data = getProjectLogById(id);
      if (data) {
        setLog(data);
        // Bind fields
        setTitle(data.title);
        setSummary(data.summary);
        setPurpose(data.purpose);
        setTechStackInput(data.techStack.join(", "));
        setFeaturesInput(data.features.join("\n"));
        setImplementationSummary(data.implementationSummary);
        setLearned(data.learned);
        setDifficulties(data.difficulties);
        setImprovements(data.improvements);
        setPortfolioDescription(data.portfolioDescription);
        setAssignmentSummary(data.assignmentSummary);
        setReadmeSummary(data.readmeSummary || "");
        setCommitSummary(data.commitSummary || "");
        setDeployAnalysis(data.deployAnalysis || "");
      }
    }
  }, [id]);

  if (!log) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080a10]">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
          <p className="text-slate-400">해당 프로젝트 로그를 찾을 수 없습니다.</p>
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
      purpose,
      techStack: finalTech,
      features: finalFeatures,
      implementationSummary,
      learned,
      difficulties,
      improvements,
      portfolioDescription,
      assignmentSummary,
      readmeSummary,
      commitSummary,
      deployAnalysis,
    };

    const saved = updateProjectLog(updated);
    setLog(saved);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("정말로 이 프로젝트 로그를 완전히 삭제하시겠습니까?")) {
      deleteProjectLog(log.id);
      router.push("/logs");
    }
  };

  const handleCopyMarkdown = () => {
    const markdown = `
# 📝 ${title}
> **${summary}**

- **GitHub Repository**: [코드 보러가기](${log.githubUrl})
- **Deploy URL**: [실배포 페이지](${log.deployUrl})
- **기록 생성일**: ${log.date}

---

## 🎯 1. 프로젝트 목적
${purpose}

## 🛠️ 2. 기술 스택
${techStackInput.split(",").map((t) => `\`${t.trim()}\``).join(" ")}

## 🌟 3. 주요 구현 기능
${featuresInput.split("\n").map((f) => `- ${f.trim()}`).join("\n")}

## 🚀 4. 구현 과정 요약
${implementationSummary}

---

## 🧠 5. 배움과 성장
### ✏️ 오늘 배운 점
${learned}

### ⚠️ 어려웠던 점
${difficulties}

### 💡 개선할 점
${improvements}

---

## 💼 6. 제출 및 포트폴리오 요약
### 📁 포트폴리오 카드 설명
\`\`\`text
${portfolioDescription}
\`\`\`

### 🎓 과제 제출용 요약
> ${assignmentSummary}
    `.trim();

    navigator.clipboard.writeText(markdown);
    setCopiedType("markdown");
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080a10]">
      {/* Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Container */}
      <main className="flex-grow mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation / Actions Header */}
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
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white transition"
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
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
            >
              <Trash2 className="h-4 w-4" />
              <span>로그 삭제</span>
            </button>
          </div>
        </div>

        {/* Project Header Info */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#0c101b]/50 p-6 md:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl sm:text-2xl font-extrabold text-white bg-white/[0.02] border border-white/[0.08] rounded-xl px-3 py-1.5 focus:border-violet-500 focus:outline-none w-full max-w-xl"
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
              className="text-sm text-slate-300 bg-white/[0.02] border border-white/[0.08] rounded-xl px-3 py-1.5 focus:border-violet-500 focus:outline-none w-full"
            />
          ) : (
            <p className="text-sm text-slate-300 font-medium">
              {log.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/[0.04]">
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
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>{log.deployUrl.replace(/^https?:\/\//, "")}</span>
            </a>
          </div>
        </section>

        {/* 4-Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SECTION 1: 개요 및 기능 */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c101b]/30 p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
              <Layers className="h-4 w-4" />
              <span>프로젝트 구성 및 목적</span>
            </h2>

            {/* Purpose */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">프로젝트 목적</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{purpose}</p>
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
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {log.techStack.map((tech, i) => (
                    <span key={i} className="rounded bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] text-violet-400">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">핵심 구현 기능</span>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
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

          {/* SECTION 2: 개발 저널 */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c101b]/30 p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
              <Cpu className="h-4 w-4" />
              <span>개발 과정 및 성장 기록</span>
            </h2>

            {/* Implementation Summary */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">구현 과정 요약</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={implementationSummary}
                  onChange={(e) => setImplementationSummary(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{implementationSummary}</p>
              )}
            </div>

            {/* Learned */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">오늘 배운 점</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={learned}
                  onChange={(e) => setLearned(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{learned}</p>
              )}
            </div>

            {/* Difficulties */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">어려웠던 점</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={difficulties}
                  onChange={(e) => setDifficulties(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{difficulties}</p>
              )}
            </div>

            {/* Improvements */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">개선할 점</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{improvements}</p>
              )}
            </div>
          </div>

          {/* SECTION 3: 과제 제출 및 포트폴리오 */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c101b]/30 p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
              <Award className="h-4 w-4" />
              <span>포트폴리오 & 과제 제출</span>
            </h2>

            {/* Portfolio description */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">포트폴리오 설명</span>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={portfolioDescription}
                  onChange={(e) => setPortfolioDescription(e.target.value)}
                  className="w-full text-xs font-mono text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <pre className="text-[10px] text-slate-300 font-mono leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl whitespace-pre-wrap">{portfolioDescription}</pre>
              )}
            </div>

            {/* Assignment summary */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">과제 제출용 요약</span>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={assignmentSummary}
                  onChange={(e) => setAssignmentSummary(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{assignmentSummary}</p>
              )}
            </div>
          </div>

          {/* SECTION 4: 자동 수집 분석 요약 */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c101b]/30 p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
              <BookOpen className="h-4 w-4" />
              <span>GitHub / Deploy 원본 분석</span>
            </h2>

            {/* Readme Summary */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">README 요약</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={readmeSummary}
                  onChange={(e) => setReadmeSummary(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <p className="text-xs text-slate-350 leading-relaxed">{readmeSummary || "README 데이터 없음."}</p>
              )}
            </div>

            {/* Commit Summary */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">최근 커밋 이력</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={commitSummary}
                  onChange={(e) => setCommitSummary(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{commitSummary || "커밋 이력 없음."}</p>
              )}
            </div>

            {/* Deploy Analysis */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">배포 페이지 구조 분석</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={deployAnalysis}
                  onChange={(e) => setDeployAnalysis(e.target.value)}
                  className="w-full text-xs text-white bg-white/[0.02] border border-white/[0.08] rounded-xl p-2.5 focus:outline-none focus:border-violet-500"
                />
              ) : (
                <p className="text-xs text-slate-350 leading-relaxed">{deployAnalysis || "배포 페이지 크롤링 정보 없음."}</p>
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
    </div>
  );
}
