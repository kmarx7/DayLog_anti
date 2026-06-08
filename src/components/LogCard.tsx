"use client";

import React from "react";
import Link from "next/link";
import { Globe, Calendar, ArrowRight, Trash2 } from "lucide-react";
import Github from "@/components/GithubIcon";
import { ProjectLog } from "@/types";

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

type LogCardProps = {
  log: ProjectLog;
  onDelete?: (id: string, e: React.MouseEvent) => void;
};

export default function LogCard({ log, onDelete }: LogCardProps) {
  const getBadgeStyle = (status: ProjectLog["status"]) => {
    switch (status) {
      case "complete":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-450";
      case "github_only":
        return "bg-amber-500/10 border-amber-500/20 text-amber-450";
      case "deploy_error":
        return "bg-rose-500/10 border-rose-500/20 text-rose-450";
      default:
        return "bg-red-500/10 border-red-500/20 text-red-400";
    }
  };

  const getStatusText = (status: ProjectLog["status"]) => {
    switch (status) {
      case "complete":
        return "분석 완료";
      case "github_only":
        return "GitHub만";
      case "deploy_error":
        return "배포 오류";
      default:
        return "오류";
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c101b]/50 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-xl hover:shadow-violet-500/[0.02] glow-effect">
      <div>
        {/* Top Info */}
        <div className="flex items-start justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-450 font-medium">
            <Calendar className="h-3 w-3" />
            {log.date}
          </span>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${getBadgeStyle(log.status)}`}>
              {getStatusText(log.status)}
            </span>
            {onDelete && (
              <button
                onClick={(e) => onDelete(log.id, e)}
                className="rounded-lg p-1 text-slate-500 hover:bg-white/[0.04] hover:text-rose-450 transition"
                title="삭제"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3.5 text-base font-bold text-white tracking-tight group-hover:text-violet-400 transition duration-200">
          {log.title}
        </h3>

        {/* One line summary */}
        <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
          {log.summary}
        </p>

        {/* User Memo (if exists) */}
        {log.userMemo && (
          <div className="mt-3 rounded-lg bg-white/[0.02] border border-white/[0.04] p-2">
            <p className="text-[10px] italic text-slate-450 line-clamp-1">
              &quot;{log.userMemo}&quot;
            </p>
          </div>
        )}

        {/* Tech Stack Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {log.techStack.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className={`rounded-md border px-2 py-0.5 text-[10px] font-medium transition duration-200 ${getTechBadgeStyle(tech)}`}
            >
              {tech}
            </span>
          ))}
          {log.techStack.length > 4 && (
            <span className="text-[9px] font-semibold text-slate-500 self-center pl-0.5">
              +{log.techStack.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.04] pt-4">
        {/* Links */}
        <div className="flex items-center gap-2.5">
          <a
            href={log.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
          >
            <Github className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <a
            href={log.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-450" />
            <span className="hidden sm:inline">배포지</span>
          </a>
        </div>

        {/* Detail Page Link Button */}
        <Link
          href={`/logs/${log.id}`}
          className="flex items-center gap-1 text-[11px] font-bold text-violet-400 hover:text-violet-300 transition"
        >
          <span>상세 보기</span>
          <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition duration-150" />
        </Link>
      </div>
    </div>
  );
}
