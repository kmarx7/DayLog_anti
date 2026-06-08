"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "warning" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
};

export default function Toast({ message, type = "success", isOpen, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const getStyle = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-[#0b1519]/90 border-emerald-500/25 text-emerald-400",
          icon: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />,
        };
      case "warning":
        return {
          bg: "bg-[#18110b]/90 border-rose-500/25 text-rose-400",
          icon: <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />,
        };
      default:
        return {
          bg: "bg-[#0c101b]/90 border-violet-500/25 text-violet-400",
          icon: <Info className="h-4 w-4 shrink-0 text-violet-400" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-toast">
      <div className={`flex items-center gap-3 rounded-xl border p-4 shadow-xl shadow-black/30 backdrop-blur-md ${style.bg}`}>
        {style.icon}
        <span className="text-xs font-bold leading-normal tracking-tight">{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 rounded-lg p-0.5 opacity-60 hover:opacity-100 hover:bg-white/[0.04] transition"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
