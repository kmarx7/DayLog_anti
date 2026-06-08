"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, Copy, FileCode, Trash2, Edit3, Check, Globe, 
  Layers, Sparkles, Cpu, Code
} from "lucide-react";
import Github from "@/components/GithubIcon";
import Toast from "@/components/Toast";
import { ProjectLog } from "@/types";

type ResultDisplayProps = {
  logData: Partial<ProjectLog>;
  onSave: (finalData: ProjectLog) => void;
  onCancel: () => void;
};

export default function ResultDisplay({ logData, onSave, onCancel }: ResultDisplayProps) {
  const [editedLog, setEditedLog] = useState<ProjectLog>({
    id: logData.id || "",
    title: logData.title || "",
    date: logData.date || new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }),
    githubUrl: logData.githubUrl || "",
    deployUrl: logData.deployUrl || "",
    userMemo: logData.userMemo || "",
    summary: logData.summary || "",
    techStack: logData.techStack || [],
    features: logData.features || [],
    uxUiAnalysis: logData.uxUiAnalysis || "",
    improvements: logData.improvements || "",
    githubMeta: logData.githubMeta,
    deployMeta: logData.deployMeta,
    status: logData.status || "complete",
    createdAt: logData.createdAt || new Date().toISOString(),
    updatedAt: logData.updatedAt || new Date().toISOString(),
  });

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
[앱 이름]
${editedLog.title}

[한 줄 요약]
${editedLog.summary}

[오늘의 메모]
${editedLog.userMemo || "(없음)"}

[사용 기술 스택]
${editedLog.techStack.join(", ")}

[주요 구현 기능]
${editedLog.features.map((f, i) => `${i + 1}. ${f}`).join("\n")}

[UX/UI 분석]
${editedLog.uxUiAnalysis || "(없음)"}

[개선할 점]
${editedLog.improvements}
    `.trim();

    navigator.clipboard.writeText(text);
    triggerCopyAlert("text", "앱 요약 텍스트가 클립보드에 복사되었습니다.");
  };

  const handleCopyMarkdown = () => {
    const markdown = `
# 📱 ${editedLog.title}
> **${editedLog.summary}**

- **GitHub Repository**: [코드 저장소](${editedLog.githubUrl})
- **Deploy URL**: [실배포 페이지](${editedLog.deployUrl})
- **기록 생성일**: ${editedLog.date}

---

## 🛠️ 1. 사용 기술 스택
${editedLog.techStack.map((tech) => `\`${tech}\``).join(" ")}

## 🌟 2. 주요 구현 기능
${editedLog.features.map((f) => `- ${f}`).join("\n")}

---

## 🎨 3. UX/UI 분석 & 피드백
${editedLog.uxUiAnalysis || "분석 내용 없음."}

## 💡 4. 향후 개선 및 보완할 점
${editedLog.improvements}

---

## ✏️ 5. 오늘의 메모
> ${editedLog.userMemo || "기록된 한 줄 소감이 없습니다."}
    `.trim();

    navigator.clipboard.writeText(markdown);
    triggerCopyAlert("markdown", "README 마크다운 템플릿이 클립보드에 복사되었습니다.");
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(editedLog, null, 2));
    triggerCopyAlert("json", "앱 로그 JSON 데이터가 클립보드에 복사되었습니다.");
  };

  const handleSave = () => {
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

  const renderBadge = () => {
    switch (editedLog.status) {
      case "complete":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            분석 완료
          </span>
        );
      case "github_only":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            GitHub만
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
            오류
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Top Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-[#0c101b]/40 p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-white tracking-tight">
              {isEditing ? "오늘 만든 앱 초안 편집" : "오늘 만든 앱 분석 피드"}
            </h2>
            {renderBadge()}
          </div>
          <p className="mt-1 text-xs text-slate-450 leading-relaxed">
            AI가 소스코드와 라이브 페이지 구조를 읽어 요약했습니다. 내용을 검토해 보세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/[0.08] hover:text-white transition active:scale-95"
          >
            <Edit3 className="h-4 w-4" />
            <span>{isEditing ? "프리뷰 모드" : "편집 모드"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowJsonPreview(true)}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/[0.08] hover:text-white transition active:scale-95"
          >
            <FileCode className="h-4 w-4" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Editor Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-white/[0.08] bg-[#0c101b]/50 p-6 md:p-8">
        
        {/* Left Column: Basic App Details & Memo */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.04]">
            <Layers className="h-4 w-4 text-violet-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350">앱 기본 기록 정보</h3>
          </div>

          {/* App Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">앱 이름</label>
            {isEditing ? (
              <input
                type="text"
                value={editedLog.title}
                onChange={(e) => setEditedLog({ ...editedLog, title: e.target.value })}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.01] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
              />
            ) : (
              <p className="text-sm font-bold text-white bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl">{editedLog.title}</p>
            )}
          </div>

          {/* One line summary */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">한 줄 요약</label>
            {isEditing ? (
              <input
                type="text"
                value={editedLog.summary}
                onChange={(e) => setEditedLog({ ...editedLog, summary: e.target.value })}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.01] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
              />
            ) : (
              <p className="text-xs text-slate-300 bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl leading-relaxed">{editedLog.summary}</p>
            )}
          </div>

          {/* User Memo */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">오늘의 한 줄 메모</label>
            {isEditing ? (
              <textarea
                rows={3}
                value={editedLog.userMemo || ""}
                onChange={(e) => setEditedLog({ ...editedLog, userMemo: e.target.value })}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.01] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition resize-none"
              />
            ) : (
              <p className="text-xs text-slate-350 bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl italic leading-relaxed">
                &quot;{editedLog.userMemo || "작성된 소감이 없습니다."}&quot;
              </p>
            )}
          </div>

          {/* Features */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">주요 구현 기능 (줄바꿈 구분)</label>
            {isEditing ? (
              <textarea
                rows={4}
                value={featuresInput}
                onChange={(e) => {
                  setFeaturesInput(e.target.value);
                  const arr = e.target.value.split("\n").map(f => f.trim()).filter(Boolean);
                  setEditedLog({ ...editedLog, features: arr });
                }}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.01] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition resize-none"
              />
            ) : (
              <ul className="list-inside list-disc space-y-1 text-xs text-slate-350 bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl">
                {editedLog.features.map((feat, i) => (
                  <li key={i} className="leading-relaxed">{feat}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Tech Stack & UX/UI Analysis */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.04]">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-355">개발자 테크 & 인터페이스 스펙</h3>
          </div>

          {/* Tech Stack */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">사용 기술 스택 (쉼표 구분)</label>
            {isEditing ? (
              <input
                type="text"
                value={techInput}
                onChange={(e) => {
                  setTechInput(e.target.value);
                  const arr = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                  setEditedLog({ ...editedLog, techStack: arr });
                }}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.01] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
              />
            ) : (
              <div className="flex flex-wrap gap-1.5 bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl">
                {editedLog.techStack.map((tech, i) => (
                  <span key={i} className="rounded-md bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 text-[10px] text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* UX/UI Analysis */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">UX/UI 관련 분석 및 장점</label>
            {isEditing ? (
              <textarea
                rows={4}
                value={editedLog.uxUiAnalysis || ""}
                onChange={(e) => setEditedLog({ ...editedLog, uxUiAnalysis: e.target.value })}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.01] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition resize-none"
              />
            ) : (
              <p className="text-xs text-slate-350 leading-relaxed bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl whitespace-pre-wrap">{editedLog.uxUiAnalysis}</p>
            )}
          </div>

          {/* Improvements */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">향후 개선할 점</label>
            {isEditing ? (
              <textarea
                rows={3}
                value={editedLog.improvements}
                onChange={(e) => setEditedLog({ ...editedLog, improvements: e.target.value })}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.01] py-2.5 px-3.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition resize-none"
              />
            ) : (
              <p className="text-xs text-slate-350 leading-relaxed bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl whitespace-pre-wrap">{editedLog.improvements}</p>
            )}
          </div>
        </div>

      </div>

      {/* Action panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center gap-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/[0.08] hover:text-white transition active:scale-95"
          >
            {copiedType === "text" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copiedType === "text" ? "복사 완료" : "내용 복사"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/[0.08] hover:text-white transition active:scale-95"
          >
            {copiedType === "markdown" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copiedType === "markdown" ? "MD 복사 완료" : "Markdown 복사"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-rose-450 hover:text-rose-400 transition"
          >
            <Trash2 className="h-4 w-4 shrink-0" />
            <span>기록 취소</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-650 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/15 hover:from-violet-500 hover:to-indigo-600 transition active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>보관함에 저장하기</span>
          </button>
        </div>
      </div>

      {/* JSON Preview Modal */}
      {showJsonPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#04060a]/80 backdrop-blur-sm" onClick={() => setShowJsonPreview(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c101b] p-6 shadow-2xl glow-effect">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <h3 className="text-base font-bold text-white">App Log JSON Data</h3>
              <button onClick={() => setShowJsonPreview(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="mt-4 max-h-[400px] overflow-y-auto rounded-xl bg-[#030712] p-4 text-left">
              <pre className="text-xs font-mono text-emerald-450 leading-relaxed whitespace-pre-wrap">
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

      {/* Toast */}
      <Toast 
        message={toastMsg} 
        isOpen={toastOpen} 
        onClose={() => setToastOpen(false)} 
        type={toastType} 
      />
    </div>
  );
}
