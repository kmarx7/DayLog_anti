import { ApiKeys, ProjectLog } from "@/types";

// Enhanced Mock Generator delivering rich, expert-level UX/UI and Tech reviews
export function generateMockAnalysis(
  repoName: string,
  githubMeta: any,
  deployMeta: any,
  userMemo?: string
): Omit<ProjectLog, "id" | "date" | "githubUrl" | "deployUrl" | "userMemo" | "createdAt" | "updatedAt"> {
  const language = githubMeta.language || "JavaScript/TypeScript";
  
  let techStack = githubMeta.inferredTech || [];
  if (techStack.length === 0) {
    techStack = [language];
    if (githubMeta.languages) {
      techStack = Object.keys(githubMeta.languages).slice(0, 3);
    }
  }
  
  if (githubMeta.readmeText && githubMeta.readmeText.toLowerCase().includes("tailwind") && !techStack.includes("Tailwind CSS")) {
    techStack.push("Tailwind CSS");
  }

  // Generate detailed roles for tech stack
  const detailedTechStack = techStack.map((tech: string) => {
    if (tech.toLowerCase() === "react") return "React (컴포넌트 기반 UI 아키텍처 및 선언적 상태 제어)";
    if (tech.toLowerCase().includes("next")) return "Next.js (App Router 기반 SSR/SSG 렌더링 및 최적화 라우팅)";
    if (tech.toLowerCase().includes("tailwind")) return "Tailwind CSS (유틸리티 클래스 기반 고성능 반응형 스타일링)";
    if (tech.toLowerCase() === "typescript" || tech.toLowerCase() === "ts") return "TypeScript (정적 타입 안정성 확보 및 컴파일 시점 에러 탐지)";
    if (tech.toLowerCase().includes("supabase")) return "Supabase (PostgreSQL 릴레이션 데이터베이스 및 실시간 Auth 연동)";
    if (tech.toLowerCase().includes("firebase")) return "Firebase (Firestore NoSQL 데이터 캐싱 및 호스팅)";
    return `${tech} (프로젝트 코어 라이브러리 및 주요 모듈 구성)`;
  });

  const cleanTitle = repoName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let features = [
    "GitHub API 및 Deploy URL을 입력받아 프로젝트 정보를 자동 수집하는 기능",
    "수집된 메타데이터를 기반으로 기술 스택, 핵심 기능, 학습 내용 자동 분석",
  ];

  if (deployMeta.headings && deployMeta.headings.length > 0) {
    features = deployMeta.headings
      .slice(0, 4)
      .map((h: string) => `${h} 화면 구성 및 사용자 인터페이스(UI) 제공`);
  }

  // Deep UI/UX mock review
  const headingsInfo = deployMeta.headings && deployMeta.headings.length > 0
    ? `H1/H2 표제 계층 구조(${deployMeta.headings.slice(0, 3).join(" ➔ ")})를 통해 정보의 중요도를 시각적으로 뚜렷하게 나열했습니다.`
    : "타이틀 중심의 단일 섹션 레이아웃으로, 주요 정보로의 집중도를 유도하는 시각 아키텍처를 가집니다.";

  const buttonsInfo = deployMeta.buttons && deployMeta.buttons.length > 0
    ? `CTA(Call-To-Action) 버튼 요소로 "${deployMeta.buttons.join(", ")}"를 배치해 사용자의 상호작용 흐름과 다음 단계 유도를 직관적으로 명시하고 있습니다.`
    : "인터랙티브 트리거의 수를 간소화해 인지 과부하(Cognitive Load)를 차단하는 미니멀한 UI 구조를 띱니다.";

  const platformInfo = deployMeta.platform !== "Other" 
    ? `${deployMeta.platform} 배포망 인프라의 캐싱 및 Edge CDN 최적화 덕분에 로딩 속도(LCP) 지표에서 유리한 UX 환경을 보여줍니다.`
    : "독자적인 도메인 웹 포트를 통해 서빙 중이며 첫 화면 렌더링 응답이 원활하게 유지되고 있습니다.";

  const uxUiAnalysis = deployMeta.isReachable
    ? `[레이아웃 및 정보 아키텍처]\n${headingsInfo}\n\n[인터랙션 및 CTA 설계]\n${buttonsInfo}\n\n[성능 및 사용성 관점]\n페이지 제목 "${deployMeta.title || cleanTitle}" 아래 핵심 메타 요약을 배치하여 랜딩 첫 화면의 가독성을 높였습니다. ${platformInfo}`
    : "배포지 도달 가능 여부(Reachability) 체크 결과 실패로 인해 세부 HTML 태그 상호작용 및 디자인 요소를 판별하지 못했습니다. 사이트 실행 상태를 검증해 주시기 바랍니다.";

  return {
    title: deployMeta.title || cleanTitle,
    summary: `${cleanTitle}은(는) ${techStack.join(", ")} 스택을 토대로 구축된 최적화된 웹 앱입니다.`,
    techStack: detailedTechStack,
    features,
    uxUiAnalysis,
    improvements: `[기술 보완점]\n- 공통 비즈니스 로직을 커스텀 훅(Custom Hook)으로 추출해 유지보수 편의성 증대 필요\n- 사용 기술 라이브러리의 불필요한 번들 크기 경량화(Tree Shaking) 적용\n\n[UX/UI 보완점]\n- 웹 접근성(WAI-ARIA) 가이드를 준수하기 위한 키보드 포커스 아웃라인 및 스크린 리더용 레이블 지정\n- 버튼이나 상호작용 요소의 로딩 상태(Skeleton, Spinner) 피드백 보완`,
    status: deployMeta.isReachable ? "complete" : "deploy_error"
  };
}

export async function generateAiAnalysis(
  githubMeta: any,
  deployMeta: any,
  userMemo: string | undefined,
  apiKeys: ApiKeys
): Promise<any> {
  const { aiProvider, openaiApiKey, geminiApiKey } = apiKeys;

  const prompt = `
당신은 전 세계 상위 1%의 시니어 풀스택 개발자이자 최고 권위의 UX/UI 인터페이스 설계 전문가입니다.
제공된 GitHub 리포지토리의 소스코드 디펜던시와 배포 라이브 페이지의 크롤링 메타데이터를 기반으로, 개발자가 반드시 기록해두어야 할 **'매우 자세하고 날카로운 기술 및 UX/UI 분석 보고서'**를 작성해 주십시오.

톤앤매너는 엄격하고 정교한 개발사 전문 기술 리뷰어 스타일이어야 하며, 두루뭉술한 칭찬 대신 분석 데이터에 기반해 구체적인 사실을 평가해야 합니다.

[입력 데이터]
1. GitHub 정보:
   - 저장소 이름: ${githubMeta.repoName}
   - 소유자: ${githubMeta.owner}
   - 설명: ${githubMeta.description}
   - 주 언어 및 비율: ${JSON.stringify(githubMeta.languages)}
   - package.json 기술 리스트: ${JSON.stringify(githubMeta.inferredTech)}
   - 최근 5개 커밋 메시지: ${JSON.stringify(githubMeta.recentCommits)}
   - README.md 본문 일부: ${githubMeta.readmeText ? githubMeta.readmeText.substring(0, 2000) : "(없음)"}

2. 배포 라이브 페이지 크롤링 데이터:
   - 접속 가능 여부: ${deployMeta.isReachable}
   - HTML Title: ${deployMeta.title}
   - Meta Description: ${deployMeta.description}
   - H1, H2 표제어 리스트: ${JSON.stringify(deployMeta.headings)}
   - 주요 버튼/링크 텍스트: ${JSON.stringify(deployMeta.buttons)}
   - 추정 플랫폼: ${deployMeta.platform}

3. 개발자 메모:
   - 소감: ${userMemo || "(없음)"}

[출력 요구사항]
반드시 다음 키들을 가지는 JSON 형식의 문자열 하나만 리턴해 주십시오. 다른 설명, 마크다운 코드 블록(\`\`\`json ...) 없이 오직 순수 JSON 데이터만 출력해야 파싱이 정상적으로 이루어집니다.

JSON 형식 가이드:
{
  "title": "앱/프로젝트명 (배포 타이틀이나 GitHub 이름을 다듬은 세련된 명칭)",
  "summary": "핵심 한 줄 요약 (사용 기술과 서비스 목적이 명확히 담겨야 함, 60자 내외)",
  "techStack": [
    "기술이름 (이 기술이 프로젝트 코드에서 왜 사용되었고 어떤 설계 장점을 주는지 디펜던시 분석 기반으로 서술. 예: 'Next.js (App Router 기반 SSR 렌더링으로 초기 LCP 속도 개선 및 동적 라우트 처리 담당)')",
    "동일한 규칙으로 다른 기술들도 자세히 기술해 주십시오."
  ],
  "features": [
    "구현된 핵심 기능 명세 1 (구체적 행위 기술)",
    "구현된 핵심 기능 명세 2",
    "구현된 핵심 기능 명세 3"
  ],
  "uxUiAnalysis": "[정보 아키텍처 및 계층 분석]\\n수집된 H1, H2 태그 구조와 Title을 분석하여, 사용자가 앱 진입 시 정보의 시각적 하이어라키(Visual Hierarchy)를 적절하게 파악할 수 있는지 전문적으로 서술하십시오.\\n\\n[인터랙션 및 CTA 설계]\\n수집된 버튼 텍스트들을 토대로, 사용자가 즉각적으로 수행할 수 있는 인터랙티브 액션과 주동선(CTA)이 명확한지, 인지 부하가 적은 구조인지 분석하십시오.\\n\\n[레이아웃 및 반응형 디자인]\\n화면 설계의 일관성과 여백 설계 수준 및 도메인 플랫폼 배포 지연이 사용성에 미치는 렌더링 영향도를 3~4문장으로 서술해 주십시오.",
  "improvements": "[소스코드/기술 관점]\\n- 코드 최적화, 상태 관리 최적화, 번들 최소화 등을 위한 구체적 솔루션 제안\\n\\n[UX/UI 인터페이스 관점]\\n- 컴포넌트 로딩 피드백(Skeleton UI 등) 필요성, 색상 명도 대비율 준수 여부, 터치 영역 크기 조절 등 실무 사용성을 개선할 수 있는 구체적인 피드백 제시"
}
`;

  if (aiProvider === "openai" && openaiApiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "You are a senior fullstack developer and UX/UI expert." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const rawText = data.choices[0].message.content.trim();
      return JSON.parse(rawText);
    } catch (err) {
      console.error("OpenAI call failed, falling back to mock:", err);
      return null;
    }
  } else if (aiProvider === "gemini" && geminiApiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text.trim();
      return JSON.parse(rawText);
    } catch (err) {
      console.error("Gemini call failed, falling back to mock:", err);
      return null;
    }
  }

  return null;
}
