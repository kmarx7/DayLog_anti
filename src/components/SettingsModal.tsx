"use client";

import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, Save, Key, Info, Check } from "lucide-react";
import Github from "@/components/GithubIcon";
import { ApiKeys } from "@/types";
import { getApiKeys, saveApiKeys } from "@/lib/storage";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

export default function SettingsModal({ isOpen, onClose, onSaved }: SettingsModalProps) {
  const [keys, setKeys] = useState<ApiKeys>({ aiProvider: "mock" });
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [showGithub, setShowGithub] = useState(false);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeys(getApiKeys());
      setIsSavedSuccessfully(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiKeys(keys);
    setIsSavedSuccessfully(true);
    setTimeout(() => {
      setIsSavedSuccessfully(false);
      if (onSaved) onSaved();
      onClose();
    }, 8000); // 800ms
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#04060a]/85 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c101b] p-6 shadow-2xl transition-all duration-300 scale-100 glow-effect">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">API 설정 및 키 관리</h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/[0.04] hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              AI 분석 분석기 (Provider)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "mock", label: "Mock 분석 (기본)", desc: "API Key 불필요" },
                { id: "openai", label: "OpenAI GPT", desc: "gpt-4o-mini" },
                { id: "gemini", label: "Gemini", desc: "1.5-flash" },
              ].map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => setKeys({ ...keys, aiProvider: prov.id as any })}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition duration-200 ${
                    keys.aiProvider === prov.id
                      ? "border-violet-500 bg-violet-650/10 text-white"
                      : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:border-white/[0.12] hover:text-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold">{prov.label}</span>
                  <span className="mt-1 text-[9px] opacity-75">{prov.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-white/[0.06] my-2" />

          {/* OpenAI API Key */}
          {keys.aiProvider === "openai" && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="block text-xs font-semibold text-slate-300">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showOpenAI ? "text" : "password"}
                  value={keys.openaiApiKey || ""}
                  onChange={(e) => setKeys({ ...keys, openaiApiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 pl-3 pr-10 text-sm text-white placeholder-slate-650 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenAI(!showOpenAI)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showOpenAI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Gemini API Key */}
          {keys.aiProvider === "gemini" && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="block text-xs font-semibold text-slate-300">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showGemini ? "text" : "password"}
                  value={keys.geminiApiKey || ""}
                  onChange={(e) => setKeys({ ...keys, geminiApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 pl-3 pr-10 text-sm text-white placeholder-slate-650 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowGemini(!showGemini)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* GitHub Token */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Github className="h-3.5 w-3.5" />
                GitHub Personal Access Token (선택)
              </label>
            </div>
            <div className="relative">
              <input
                type={showGithub ? "text" : "password"}
                value={keys.githubToken || ""}
                onChange={(e) => setKeys({ ...keys, githubToken: e.target.value })}
                placeholder="github_pat_..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-2.5 pl-3 pr-10 text-sm text-white placeholder-slate-650 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition duration-150"
              />
              <button
                type="button"
                onClick={() => setShowGithub(!showGithub)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showGithub ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="flex items-start gap-1 text-[10px] text-slate-450 leading-relaxed pt-0.5">
              <Info className="h-3 w-3 mt-0.5 shrink-0 text-slate-400" />
              <span>
                개인(Private) 리포지토리를 분석하거나 API 요청 속도 제한(Rate Limit)을 피하려면 토큰을 등록해 주세요. 설정한 키는 브라우저 내부 localStorage에만 안전하게 저장됩니다.
              </span>
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-7 flex items-center justify-end gap-2 border-t border-white/[0.06] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.04] hover:text-white transition duration-200"
          >
            취소
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={isSavedSuccessfully}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-650 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/15 transition hover:from-violet-500 hover:to-indigo-600 active:scale-95 disabled:opacity-50"
          >
            {isSavedSuccessfully ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>저장 완료!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>설정 저장하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
