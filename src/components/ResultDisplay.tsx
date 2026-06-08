"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, Copy, FileCode, Trash2, Edit3, Check, Globe, 
  Layers, BookOpen, GraduationCap, Briefcase, ChevronRight,
  Cpu, Target, Sparkles, AlertCircle, FileText, Code
} from "lucide-react";
import Github from "@/components/GithubIcon";
import Toast from "@/components/Toast";
import { ProjectLog } from "@/types";

type ResultDisplayProps = {
  logData: Partial<ProjectLog>;
  onSave: (finalData: ProjectLog) => void;
  onCancel: () => void;
};

type ActiveTab = "basic" | "journey" | "export" | "meta";

export default function ResultDisplay({ logData, onSave, onCancel }: ResultDisplayProps) {
  const [editedLog, setEditedLog] = useState<ProjectLog>({
    id: logData.id || "",
    title: logData.title || "",
    date: logData.date || new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }),
    githubUrl: logData.githubUrl || "",
    deployUrl: logData.deployUrl || "",
    userMemo: logData.userMemo || "",
    summary: logData.summary || "",
    purpose: logData.purpose || "",
    techStack: logData.techStack || [],
    features: logData.features || [],
    implementationSummary: logData.implementationSummary || "",
    learned: logData.learned || "",
    difficulties: logData.difficulties || "",
    improvements: logData.improvements || "",
    portfolioDescription: logData.portfolioDescription || "",
    assignmentSummary: logData.assignmentSummary || "",
    readmeSummary: logData.readmeSummary || "",
    commitSummary: logData.commitSummary || "",
    deployAnalysis: logData.deployAnalysis || "",
    githubMeta: logData.githubMeta,
    deployMeta: logData.deployMeta,
    status: logData.status || "complete",
    createdAt: logData.createdAt || new Date().toISOString(),
    updatedAt: logData.updatedAt || new Date().toISOString(),
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("basic");
  const [isEditing, setIsEditing] = useState(true);
  const [copiedType, setCopiedType] = useState<"text" | "markdown" | "json" | null>(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  // Toast states
  const [toastMsg, setToastMsg] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "warning" | "info">("success");

  // Temporary state for text-array inputs
  const [techInput, setTechInput] = useState(editedLog.techStack.join(", "));
  const [featuresInput, setFeaturesInput] = useState(editedLog.features.join("\n"));

  const triggerCopyAlert = (type: "text" | "markdown" | "json", message: string) => {
    setCopiedType(type);
    setToastMsg(message);
    setToastType("success");
    setToastOpen(true);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyText = () => {
    const text = `
[프로젝트 명]
${editedLog.title}

[한 줄 요약]
${editedLog.summary}

[프로젝트 목적]
${editedLog.purpose}

[사용 기술]
${editedLog.techStack.join(", ")}

[핵심 기능]
${editedLog.features.map((f, i) => `${i + 1}. ${f}`).join("\n")}

[오늘 배운 점]
${editedLog.learned}

[개선할 점]
${editedLog.improvements}
    `.trim();

    navigator.clipboard.writeText(text);
    triggerCopyAlert("text", "프로젝트 핵심 요약본이 클립보드에 복사되었습니다.");
  };

  const handleCopyMarkdown = () => {
    const markdown = `
# 📝 ${editedLog.title}
> **${editedLog.summary}**

- **GitHub Repository**: [코드 보러가기](${editedLog.githubUrl})
- **Deploy URL**: [실배포 페이지](${editedLog.deployUrl})
- **기록 생성일**: ${editedLog.date}

---

## 🎯 1. 프로젝트 목적
${editedLog.purpose}

## 🛠️ 2. 기술 스택
${editedLog.techStack.map((tech) => `\`${tech}\``).join(" ")}

## 🌟 3. 주요 구현 기능
${editedLog.features.map((f) => `- ${f}`).join("\n")}

## 🚀 4. 구현 과정 요약
${editedLog.implementationSummary}

---

## 🧠 5. 배움과 성장
### ✏️ 오늘 배운 점
${editedLog.learned}

### ⚠️ 어려웠던 점
${editedLog.difficulties}

### 💡 개선할 점
${editedLog.improvements}

---

## 💼 6. 제출 및 포트폴리오 요약
### 📁 포트폴리오 카드 설명
\`\`\`text
${editedLog.portfolioDescription}
\`\`\`

### 🎓 과제 제출용 요약
> ${editedLog.assignmentSummary}
    `.trim();

    navigator.clipboard.writeText(markdown);
    triggerCopyAlert("markdown", "README 마크다운 템플릿이 클립보드에 복사되었습니다.");
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(editedLog, null, 2));
    triggerCopyAlert("json", "프로젝트 로그 JSON 데이터가 클립보드에 복사되었습니다.");
  };

  const handleSave = () => {
    // Parse inputs back to arrays
    const parsedTech = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const parsedFeatures = featuresInput
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const finalData: ProjectLog = {
      ...editedLog,
      techStack: parsedTech,
      features: parsedFeatures,
      updatedAt: new Date().toISOString(),
    };
    onSave(finalData);
  };

  // Build Status badge helpers
  const renderBadge = () => {
    switch (editedLog.status) {
      case "complete":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-450">
            분석 완료
          </span>
        );
      case "github_only":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-550/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            GitHub만 분석됨
          </span>
        );
      case "deploy_error":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs font-semibold text-rose-450">
            배포 URL 오류
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-xs font-semibold text-red-400">
            분석 오류
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Ribbon / Preview Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#0c101b]/40 p-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isEditing ? "프로젝트 분석 초안 편집" : "프로젝트 생성 결과"}
            </h2>
            {renderBadge()}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            AI가 소스코드와 라이브 사이트를 기반으로 초안을 작성했습니다. 필요에 맞게 커스텀해 보세요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-355 hover:bg-white/[0.08] hover:text-white transition"
          >
            <Edit3 className="h-4 w-4" />
            <span>{isEditing ? "프리뷰 모드" : "편집 모드"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowJsonPreview(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-355 hover:bg-white/[0.08] hover:text-white transition"
          >
            <FileCode className="h-4 w-4" />
            <span>JSON 보기</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Tabs Column */}
        <div className="lg:col-span-1 space-y-1">
          {[
            { id: "basic", label: "기본 프로젝트 정보", icon: Layers },
            { id: "journey", label: "개발 구현 및 학습기록", icon: GraduationCap },
            { id: "export", label: "제출 및 포트폴리오용", icon: Briefcase },
            { id: "meta", label: "GitHub/배포 데이터", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-xs font-semibold tracking-wide transition duration-150 ${
                  activeTab === tab.id
                    ? "bg-violet-650/10 border border-violet-500/25 text-white"
                    : "border border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${activeTab === tab.id ? "text-violet-400" : "text-slate-500"}`} />
                  <span>{tab.label}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              </button>
            );
          })}
        </div>

        {/* Right Editor Area */}
        <div className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-[#0c101b]/50 p-6 md:p-8 space-y-6">
          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === "basic" && (
            <div className="space-y-5 animate-slideUp">
              {/* Project Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">프로젝트명</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLog.title}
                    onChange={(e) => setEditedLog({ ...editedLog, title: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm font-semibold text-white bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">{editedLog.title}</p>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">한 줄 요약</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLog.summary}
                    onChange={(e) => setEditedLog({ ...editedLog, summary: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm text-slate-300 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">{editedLog.summary}</p>
                )}
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">프로젝트 목적</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editedLog.purpose}
                    onChange={(e) => setEditedLog({ ...editedLog, purpose: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm text-slate-350 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl whitespace-pre-wrap">{editedLog.purpose}</p>
                )}
              </div>

              {/* Tech Stack */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">사용 기술 스택 (쉼표로 구분)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => {
                      setTechInput(e.target.value);
                      const arr = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                      setEditedLog({ ...editedLog, techStack: arr });
                    }}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                    placeholder="React, Next.js, Tailwind CSS"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
                    {editedLog.techStack.length > 0 ? (
                      editedLog.techStack.map((tech, i) => (
                        <span key={i} className="rounded-lg bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs text-violet-400">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-550">지정되지 않음</span>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">주요 기능 리스트 (줄바꿈으로 구분)</label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={featuresInput}
                    onChange={(e) => {
                      setFeaturesInput(e.target.value);
                      const arr = e.target.value.split("\n").map(f => f.trim()).filter(Boolean);
                      setEditedLog({ ...editedLog, features: arr });
                    }}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                    placeholder="실시간 크롤링 기능&#10;메타데이터 정보 파싱&#10;포트폴리오 카드 생성"
                  />
                ) : (
                  <ul className="list-inside list-disc space-y-1 text-sm text-slate-350 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
                    {editedLog.features.length > 0 ? (
                      editedLog.features.map((feat, i) => (
                        <li key={i} className="leading-relaxed">{feat}</li>
                      ))
                    ) : (
                      <span className="text-xs text-slate-550">등록된 기능이 없습니다.</span>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: JOURNEY & LEARNINGS */}
          {activeTab === "journey" && (
            <div className="space-y-5 animate-slideUp">
              {/* Implementation Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">구현 과정 요약</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editedLog.implementationSummary}
                    onChange={(e) => setEditedLog({ ...editedLog, implementationSummary: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm text-slate-350 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl whitespace-pre-wrap">{editedLog.implementationSummary}</p>
                )}
              </div>

              {/* Learned */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">오늘 배운 점</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editedLog.learned}
                    onChange={(e) => setEditedLog({ ...editedLog, learned: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm text-slate-355 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl whitespace-pre-wrap">{editedLog.learned}</p>
                )}
              </div>

              {/* Difficulties */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">어려웠던 점</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editedLog.difficulties}
                    onChange={(e) => setEditedLog({ ...editedLog, difficulties: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm text-slate-355 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl whitespace-pre-wrap">{editedLog.difficulties}</p>
                )}
              </div>

              {/* Improvements */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">개선할 점</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editedLog.improvements}
                    onChange={(e) => setEditedLog({ ...editedLog, improvements: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm text-slate-355 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl whitespace-pre-wrap">{editedLog.improvements}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EXPORTS & SUMMARIES */}
          {activeTab === "export" && (
            <div className="space-y-5 animate-slideUp">
              {/* Portfolio Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">포트폴리오 카드 설명</label>
                </div>
                {isEditing ? (
                  <textarea
                    rows={5}
                    value={editedLog.portfolioDescription}
                    onChange={(e) => setEditedLog({ ...editedLog, portfolioDescription: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm font-mono text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <pre className="text-xs text-slate-300 font-mono leading-relaxed bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl whitespace-pre-wrap">{editedLog.portfolioDescription}</pre>
                )}
              </div>

              {/* Assignment Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">과제 제출용 요약</label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editedLog.assignmentSummary}
                    onChange={(e) => setEditedLog({ ...editedLog, assignmentSummary: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm text-slate-355 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl whitespace-pre-wrap">{editedLog.assignmentSummary}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SCRAPED RAW METADATA */}
          {activeTab === "meta" && (
            <div className="space-y-5 animate-slideUp">
              {/* Readme Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">README 요약</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editedLog.readmeSummary}
                    onChange={(e) => setEditedLog({ ...editedLog, readmeSummary: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm text-slate-350 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl whitespace-pre-wrap">{editedLog.readmeSummary || "README 데이터가 수집되지 않았습니다."}</p>
                )}
              </div>

              {/* Commit Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">최근 커밋 요약</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editedLog.commitSummary}
                    onChange={(e) => setEditedLog({ ...editedLog, commitSummary: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm text-slate-350 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl whitespace-pre-wrap">{editedLog.commitSummary || "커밋 데이터를 불러올 수 없습니다."}</p>
                )}
              </div>

              {/* Deploy Analysis */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">배포 사이트 크롤링 요약</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editedLog.deployAnalysis}
                    onChange={(e) => setEditedLog({ ...editedLog, deployAnalysis: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm text-slate-350 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl whitespace-pre-wrap">{editedLog.deployAnalysis || "배포 페이지 정보가 없습니다."}</p>
                )}
              </div>
            </div>
          )}

          {/* Action Row inside Card */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="flex items-center gap-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition active:scale-95"
              >
                {copiedType === "text" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copiedType === "text" ? "복사 완료" : "내용 복사"}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition active:scale-95"
              >
                {copiedType === "markdown" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copiedType === "markdown" ? "MD 복사 완료" : "Markdown 복사"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
              >
                <Trash2 className="h-4 w-4 text-rose-500" />
                <span>기록 취소</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-650 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/15 hover:from-violet-500 hover:to-indigo-600 transition active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>로그북에 저장하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Preview Modal */}
      {showJsonPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#04060a]/80 backdrop-blur-sm" onClick={() => setShowJsonPreview(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c101b] p-6 shadow-2xl glow-effect">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <h3 className="text-base font-bold text-white">Project Log JSON Data</h3>
              <button onClick={() => setShowJsonPreview(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="mt-4 max-h-[400px] overflow-y-auto rounded-xl bg-[#030712] p-4 text-left">
              <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(editedLog, null, 2)}
              </pre>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1 rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-2 text-xs font-medium text-slate-355 hover:bg-white/[0.08] hover:text-white transition"
              >
                {copiedType === "json" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedType === "json" ? "JSON 복사 완료" : "JSON 복사"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowJsonPreview(false)}
                className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      <Toast 
        message={toastMsg} 
        isOpen={toastOpen} 
        onClose={() => setToastOpen(false)} 
        type={toastType} 
      />
    </div>
  );
}
