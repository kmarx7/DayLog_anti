"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import SettingsModal from "@/components/SettingsModal";
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  Palette, 
  Cpu, 
  LayoutTemplate, 
  UserCheck,
  ChevronRight,
  BookOpen
} from "lucide-react";

interface PromptPreset {
  name: string;
  description: string;
  appName: string;
  role: string;
  techStack: string;
  aestheticStyle: string;
  colorPalette: string;
  interactions: string;
  functionality: string[];
  layout: string;
}

const PRESETS: PromptPreset[] = [
  {
    name: "아늑한 방 꾸미기 루틴 트래커 (기본 예시)",
    description: "루틴 달성률에 따라 방의 불빛이 켜지고, 스트릭으로 가구를 해금하는 아늑한 대시보드",
    appName: "아늑한 방 꾸미기 루틴 트래커 (Cosy Room Routine Tracker)",
    role: "10년 차 시니어 풀스택 개발자이자 UI/UX 디자이너. 사용자가 감동할 정도로 아늑하고 세련된 웹앱을 만들어야 함.",
    techStack: "React/Next.js (App Router), Tailwind CSS (스타일링), Lucide Icons (아이콘), SVG 인라인 코드 직접 드로잉 (해상도 저하 방지 및 고속 로드)",
    aestheticStyle: "아이소메트릭(Isometric) 3D 뷰, 미니멀리즘, 무인양품(MUJI) 스타일",
    colorPalette: "Warm Ivory(#F5EFE0) 배경, Sage Green(#8BAF8E) 포인트 및 포근한 어스 톤(Earth tones) 조합",
    interactions: "모든 버튼과 인터랙티브 요소에 부드러운 호버(hover) 스케일 및 클릭(active:scale-95) 애니메이션 적용. 새로운 아이템 등장 또는 해금 시 탄력적인 Bounce 등장 효과 적용.",
    functionality: [
      "LocalStorage를 사용하여 브라우저 새로고침이나 재접속 시에도 루틴 상태, 해금 내역, 누적 포인트가 완벽히 저장/유지되도록 구현.",
      "루틴 달성률(0% ~ 100%)에 따라 화면 한쪽에 배치된 방(Room) SVG 일러스트의 조명 밝기와 분위기가 실시간으로 은은하게 변화하는 동적 반응형 시각화 로직 구현.",
      "특정 연속 달성 일수(Streak) 또는 누적 포인트를 달성해야만 상점에서 구매하거나 배치할 수 있는 '가구 잠금해제 시스템(Progression Lock)' 및 해금 로직 포함."
    ],
    layout: "데스크톱 기준, 왼쪽에는 실시간 달성률에 따라 반응하는 큼직한 방(Room) 비주얼 영역을 배치하고, 오른쪽에는 오늘의 루틴 목록과 상점/해금 탭이 있는 2단 레이아웃(Dashboard 스타일)으로 구성."
  },
  {
    name: "인터랙티브 오션 돔 포모도로 타이머",
    description: "타이머 집중에 따라 바닷속 생태계가 살아나고, 깊은 집중 스트릭으로 물고기를 해금하는 타이머",
    appName: "오션 돔 포모도로 타이머 (Ocean Dome Pomodoro Timer)",
    role: "10년 차 시니어 프론트엔드 개발자이자 인터랙티브 아트 디자이너. 사용자가 몰입할 수 있는 시각적 쾌감을 제공하는 세련된 힐링 타이머 구현.",
    techStack: "React (Vite/Next.js), Tailwind CSS, Lucide Icons, 애니메이션 및 인터랙티브 SVG 그래픽 직접 렌더링",
    aestheticStyle: "Glassmorphism (배경 블러, 반투명 유리 효과), 딥 블루 아쿠아 톤, 모던 네오 브루탈리즘 터치",
    colorPalette: "Deep Abyss Blue(#0A1128) 어두운 배경, 활기찬 Cyan(#00F0FF) 및 Neon Mint(#39FF14) 포인트 컬러",
    interactions: "타이머 시작/일시정지 시 오션 돔 내부의 물결이 출렁이는 애니메이션 효과. 물고기 탄생 시 물방울 스플래시 효과 및 부드러운 스케일업 트랜지션.",
    functionality: [
      "LocalStorage를 사용하여 사용자의 집중 시간 기록, 오늘 획득한 조개(포인트), 해금된 해양 생물 데이터가 보존되도록 구현.",
      "포모도로 25분 집중 세션이 완료되거나 타이머가 흐르는 동안, 집중도에 따라 바닷속 오션 돔(Deep Ocean Dome) SVG 그래픽 내부의 식물과 해초가 자라나며, 달성도가 실시간 물결 높이 및 투명도로 시각화됨.",
      "25분 완료 스트릭을 성공할 때마다 상점에서 새로운 바다 생물(해파리, 아기 고래 등)을 해금하여 돔 안에 배치할 수 있는 잠금해제 시스템 탑재."
    ],
    layout: "가운데에 큼직한 투명 오션 돔 비주얼과 포모도로 원형 타이머가 중첩되어 배치되며, 하단에는 오늘 획득한 해양 생물 도감과 타이머 설정 컨트롤러가 유기적으로 흐르는 반응형 카드 그리드 레이아웃."
  },
  {
    name: "사이버펑크 네온 할일 대시보드",
    description: "완료율에 따라 도시의 네온사인이 밝아지고, 퀘스트를 완료해 도시 빌딩을 해금하는 대시보드",
    appName: "네온 시티 할일 퀘스트 (Neon City Task Quest Dashboard)",
    role: "10년 차 게임 UI 개발자 및 시니어 사이버펑크 아티스트. 테크니컬하고 화려한 네온 비주벌과 강력한 게임성(Gamification)을 결합한 스케줄러 구현.",
    techStack: "React, Tailwind CSS, Lucide Icons, 사이버펑크 픽셀/SVG 아트 요소 인라인 코딩",
    aestheticStyle: "Cyberpunk 2077 스타일, 네온 글로우(Glow) 효과, 다크 하이테크 UI 테마",
    colorPalette: "다크 카본 블랙(#0B0B0F) 배경, 일렉트릭 핫 핑크(#FF007F) 및 사이버 퍼플(#8A2BE2) 형광 대비 컬러",
    interactions: "퀘스트 완료 체크 시 홀로그램 지지직(Glitch) 효과 애니메이션. 상점 아이템 구매 시 네온 스파크 스팅어와 팝업 튀어오름 효과 적용.",
    functionality: [
      "LocalStorage 기반으로 완료된 퀘스트 목록, 획득한 크레딧(자금), 잠금해제된 도시 구역 상태를 저장하여 영구 보존.",
      "오늘의 할일(퀘스트) 달성률에 따라 중앙에 있는 네온 시티(Neon City) SVG 홀로그램 타워의 네온사인 조명 밝기가 켜지고, 오염도가 낮아지는 실시간 렌더링 로직.",
      "일일 퀘스트 3개 이상 연속 달성(Streak) 및 크레딧 축적을 통해 락이 걸린 고성능 '네온 아케이드 빌딩' 또는 '사이버 카'를 잠금해제하여 도시에 배치하는 시스템."
    ],
    layout: "2단 대시보드 구조. 좌측 60% 영역에는 반짝이는 네온 시티 SVG 홀로그램 맵을 넓게 배치하고, 우측 40% 영역에는 사이버 퀘스트 리스트(할일) 및 팩션 상점(해금 요소) 인터페이스를 정밀 배치한 화면 설계."
  }
];

export default function PromptGenerator() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Form states
  const [appName, setAppName] = useState(PRESETS[0].appName);
  const [role, setRole] = useState(PRESETS[0].role);
  const [techStack, setTechStack] = useState(PRESETS[0].techStack);
  const [aestheticStyle, setAestheticStyle] = useState(PRESETS[0].aestheticStyle);
  const [colorPalette, setColorPalette] = useState(PRESETS[0].colorPalette);
  const [interactions, setInteractions] = useState(PRESETS[0].interactions);
  const [functionality, setFunctionality] = useState(PRESETS[0].functionality.join("\n"));
  const [layout, setLayout] = useState(PRESETS[0].layout);

  // Apply preset values
  const applyPreset = (index: number) => {
    setSelectedPresetIndex(index);
    const preset = PRESETS[index];
    setAppName(preset.appName);
    setRole(preset.role);
    setTechStack(preset.techStack);
    setAestheticStyle(preset.aestheticStyle);
    setColorPalette(preset.colorPalette);
    setInteractions(preset.interactions);
    setFunctionality(preset.functionality.join("\n"));
    setLayout(preset.layout);
  };

  // Generate finalized prompt with wider line spacing
  const generatedPrompt = `## 📋 AI 생성 프로젝트 개발 요청 명세서

너는 사용자의 기획안을 바탕으로 고품질의 완성형 코드를 바로 작성해 주는 시니어 AI 코딩 전문가이다. 아래의 구체적인 가이드와 기술 요구사항, 비주얼 가이드를 철저히 준수하여 하나의 완성된 독립 실행 파일(또는 단일 컴포넌트 통합 코드)로 코드를 완성해 줘.

---

### 1. 전문가 Persona (Role Setting)
- **역할 및 품질**: ${role}

- **목표**: 어설픈 자리표시자(Placeholder)나 생략 없이, 코드만 복사해서 붙여넣어도 브라우저에서 환상적인 비주얼과 로직으로 완벽하게 동작해야 해.

---

### 2. 기술 스택 (Tech Stack)
- **기반 프레임워크**: ${techStack}

- **에셋 제약 사항**: 외부 이미지 URL이나 리소스 다운로드 없이 브라우저 내에서 완벽하게 표시되도록, 디자인 그래픽/가구/오브젝트 등은 **정교하게 작성된 인라인 SVG 코드**를 사용해 리액트/웹 컴포넌트로 직접 구현해 줘.

---

### 3. 시각적 스타일 및 UI/UX (Aesthetic)
- **컨셉 및 테마**: ${aestheticStyle}

- **컬러 팔레트**: ${colorPalette}

- **인터랙션 및 애니메이션**: ${interactions}

---

### 4. 핵심 데이터 흐름 및 기능 요구사항 (Functionality)
${functionality.split("\n").filter(line => line.trim()).map(line => `- ${line.trim()}`).join("\n\n")}

---

### 5. 레이아웃 구조 설계 (Layout)
- **레이아웃**: ${layout}

- **반응형 웹 지원**: 데스크톱 해상도에서는 위에 지정된 다단 그리드 구조로 보기 좋게 균형을 잡고, 모든 모바일 기기 크기에서는 모든 컴포넌트가 세로로 자연스럽게 정렬되는 모바일 퍼스트 반응형 레이아웃을 보장해 줘.

---

### 💡 코딩 및 출력 지침
1. **생략 금지**: \`// ... 기존 코드와 동일 ...\` 같은 방식으로 코드를 생략하거나 요약하지 말고, 전체 코드를 온전히 한 번에 복사할 수 있게 처음부터 끝까지 마크다운 코드 블록으로 출력해 줘.

2. **더미 데이터**: 앱이 시작되었을 때 밋밋하지 않도록, LocalStorage에 데이터가 없을 때 로드할 **예쁘고 매력적인 기본 Mock 데이터**를 최소 3~5개 탑재해 줘.

3. **사용성**: 사용자가 직관적으로 조작할 수 있도록 안내 툴팁이나 인터랙티브 반응을 시각적으로 강하게 표현해 줘.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080a10]">
      {/* Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Container */}
      <main className="flex-grow mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        
        {/* Intro Hero - Centered and Spaced */}
        <section className="space-y-4 max-w-3xl mx-auto text-center flex flex-col items-center py-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs text-amber-400 font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Vibe-Coding Prompt System</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent leading-tight">
            AI 프로젝트 특급 바이브 코딩 프롬프트 생성기
          </h1>
          <p className="text-xs sm:text-base text-slate-400 leading-relaxed max-w-2xl mt-1">
            AI 프로젝트 특급 과정에서 매일 새로운 미니앱을 코딩할 때, 프롬프트 작성 지침 5대 규칙
            (역할 설정, 기술 스택, 시각 스타일, 핵심 로직, 레이아웃)에 맞추어 고품질 완성형 웹앱 코드를
            단번에 받아내는 최적화 프롬프트를 빌드합니다.
          </p>
        </section>

        {/* Preset Selector */}
        <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-amber-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">원클릭 프리셋 불러오기</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(idx)}
                className={`text-left p-5 rounded-xl border transition duration-200 flex flex-col justify-between min-h-[160px] ${
                  selectedPresetIndex === idx
                    ? "bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5 text-white"
                    : "bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] text-slate-400 hover:text-slate-200"
                }`}
              >
                <div>
                  <h3 className={`text-xs font-bold tracking-tight ${selectedPresetIndex === idx ? "text-amber-300" : "text-slate-300"}`}>
                    {preset.name}
                  </h3>
                  <p className="mt-2.5 text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                    {preset.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-[10px] font-bold text-amber-400/80 gap-1 self-end">
                  <span>불러오기</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Builder Workspace: Left Form, Right Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Input Form (5 Column) */}
          <div className="lg:col-span-5 space-y-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
            <h2 className="text-sm font-bold text-white border-b border-white/[0.06] pb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-violet-400" />
              <span>프롬프트 빌더 폼</span>
            </h2>

            <div className="space-y-6 text-xs">
              {/* App Name */}
              <div className="space-y-2.5">
                <label className="block text-slate-300 font-bold">1. 앱 이름 및 핵심 주제 (App Name)</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full bg-[#0d121f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition"
                  placeholder="예: 아늑한 방 꾸미기 루틴 트래커"
                />
              </div>

              {/* Persona (Role Setting) */}
              <div className="space-y-2.5">
                <label className="block text-slate-300 font-bold flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-violet-400" />
                  <span>2. 전문가 페르소나 (Role Setting)</span>
                </label>
                <textarea
                  value={role}
                  rows={2}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#0d121f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition resize-none leading-relaxed"
                />
              </div>

              {/* Tech Stack */}
              <div className="space-y-2.5">
                <label className="block text-slate-300 font-bold flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-violet-400" />
                  <span>3. 기술 스택 지정 (Tech Stack)</span>
                </label>
                <textarea
                  value={techStack}
                  rows={2}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full bg-[#0d121f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition resize-none leading-relaxed"
                />
              </div>

              {/* Aesthetic Style & Palette */}
              <div className="space-y-4 border-t border-white/[0.04] pt-4">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Palette className="h-3.5 w-3.5 text-violet-400" />
                  <span>4. 시각적 스타일 키워드 (Aesthetic)</span>
                </div>
                
                <div className="space-y-2 pl-1">
                  <label className="block text-slate-400 text-[11px]">스타일 스타일링 무드</label>
                  <input
                    type="text"
                    value={aestheticStyle}
                    onChange={(e) => setAestheticStyle(e.target.value)}
                    className="w-full bg-[#0d121f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition"
                  />
                </div>

                <div className="space-y-2 pl-1">
                  <label className="block text-slate-400 text-[11px]">사용할 컬러 팔레트</label>
                  <input
                    type="text"
                    value={colorPalette}
                    onChange={(e) => setColorPalette(e.target.value)}
                    className="w-full bg-[#0d121f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition"
                  />
                </div>

                <div className="space-y-2 pl-1">
                  <label className="block text-slate-400 text-[11px]">인터랙션 및 트랜지션 효과</label>
                  <input
                    type="text"
                    value={interactions}
                    onChange={(e) => setInteractions(e.target.value)}
                    className="w-full bg-[#0d121f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition"
                  />
                </div>
              </div>

              {/* Functionality details */}
              <div className="space-y-2.5 border-t border-white/[0.04] pt-4">
                <label className="block text-slate-300 font-bold">5. 핵심 기능 및 데이터 흐름 (Functionality)</label>
                <p className="text-[10px] text-slate-500 mb-1.5">줄바꿈(Enter) 기준으로 각각의 개별 기능 명세 목록이 작성됩니다.</p>
                <textarea
                  value={functionality}
                  rows={4}
                  onChange={(e) => setFunctionality(e.target.value)}
                  className="w-full bg-[#0d121f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition leading-relaxed"
                />
              </div>

              {/* Layout structure */}
              <div className="space-y-2.5 border-t border-white/[0.04] pt-4">
                <label className="block text-slate-300 font-bold flex items-center gap-1.5">
                  <LayoutTemplate className="h-3.5 w-3.5 text-violet-400" />
                  <span>6. 레이아웃 구조 지정 (Layout)</span>
                </label>
                <textarea
                  value={layout}
                  rows={2}
                  onChange={(e) => setLayout(e.target.value)}
                  className="w-full bg-[#0d121f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-white/[0.06] flex justify-end">
              <button
                onClick={() => applyPreset(selectedPresetIndex)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-xs font-semibold text-slate-300 hover:bg-white/[0.06] transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>현재 프리셋 기본값 복원</span>
              </button>
            </div>
          </div>

          {/* Right: Prompt Output Preview (7 Column) */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold text-white">생성된 마스터 프롬프트 (실시간 미리보기)</h2>
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition duration-200 ${
                  copied 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10" 
                    : "bg-amber-400 text-[#080a10] hover:bg-amber-300 active:scale-95 shadow-lg shadow-amber-400/5"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>프롬프트 복사하기</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt Render Display - Larger size and looser line height */}
            <div className="bg-[#0b0f19] border border-white/[0.06] rounded-2xl p-8 sm:p-10 flex-grow min-h-[500px] font-mono text-[13px] text-slate-300 whitespace-pre-wrap leading-loose select-all overflow-y-auto max-h-[660px] shadow-inner relative">
              <div className="absolute top-3 right-4 text-[9px] font-bold text-slate-500 select-none bg-white/[0.02] px-2 py-0.5 rounded border border-white/[0.04]">
                마크다운 형식
              </div>
              {generatedPrompt}
            </div>

            {/* Quick Vibe Coding Guide */}
            <div className="rounded-xl bg-violet-500/5 border border-violet-500/10 p-5 space-y-3">
              <h3 className="text-xs font-bold text-violet-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span>어떻게 사용하나요?</span>
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed space-y-1.5">
                1. 상단의 <strong>[프롬프트 복사하기]</strong>를 클릭해 전체 템플릿을 클립보드에 담습니다.<br />
                2. 즐겨 쓰시는 AI 모델(Claude 3.5 Sonnet, GPT-4o 등)의 대화창에 붙여넣습니다.<br />
                3. AI가 생성한 완성형 코드를 복사하여 내 프로젝트 파일에 적용하고 바로 실행(vibe-coding)합니다.<br />
                4. 완성된 앱을 배포한 후, 본 서비스의 <strong>대시보드</strong>에 GitHub 주소와 배포 링크를 넣어 오늘 한 일을 멋지게 자동 분석해 기록하세요!
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
