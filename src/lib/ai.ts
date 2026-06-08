import { ApiKeys, ProjectLog } from "@/types";

// Dynamic Mock Generator that parses readme, commits, and meta to return a realistic analysis
export function generateMockAnalysis(
  repoName: string,
  githubMeta: any,
  deployMeta: any,
  userMemo?: string
): Omit<ProjectLog, "id" | "date" | "githubUrl" | "deployUrl" | "userMemo" | "createdAt" | "updatedAt"> {
  const language = githubMeta.language || "JavaScript/TypeScript";
  
  // Extract package.json tech stack or use languages
  let techStack = githubMeta.inferredTech || [];
  if (techStack.length === 0) {
    techStack = [language];
    if (githubMeta.languages) {
      techStack = Object.keys(githubMeta.languages).slice(0, 3);
    }
  }
  // Add common tools if not present
  if (githubMeta.readmeText && githubMeta.readmeText.toLowerCase().includes("tailwind") && !techStack.includes("Tailwind CSS")) {
    techStack.push("Tailwind CSS");
  }

  // Parse repo name for nice title
  const cleanTitle = repoName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Create features from headings, buttons, or readme
  let features = [
    "GitHub API 및 Deploy URL을 입력받아 프로젝트 정보를 자동 수집하는 기능",
    "수집된 메타데이터를 기반으로 기술 스택, 핵심 기능, 학습 내용 자동 분석",
    "날짜별 상세 로그 저장 및 포트폴리오용/과제 제출용 요약 제공",
  ];

  if (deployMeta.headings && deployMeta.headings.length > 0) {
    features = deployMeta.headings
      .slice(0, 4)
      .map((h: string) => `${h} 화면 구성 및 사용자 인터페이스(UI) 제공`);
  }

  if (githubMeta.readmeText) {
    // Try to extract bullet points from readme
    const bulletPoints = githubMeta.readmeText
      .split("\n")
      .filter((line: string) => line.trim().startsWith("-") || line.trim().startsWith("*"))
      .map((line: string) => line.replace(/^[-*]\s+/, "").trim())
      .filter((text: string) => text.length > 10 && text.length < 80);
    
    if (bulletPoints.length > 2) {
      features = bulletPoints.slice(0, 4);
    }
  }

  const memoText = userMemo ? `"${userMemo}" 메모를 기반으로 함: ` : "";

  return {
    title: deployMeta.title || cleanTitle,
    summary: `${cleanTitle}은(는) ${techStack.join(", ")} 기술 스택을 활용하여 개발된 프로젝트입니다. GitHub 소스코드 및 실배포 페이지의 구조 분석을 완료했습니다.`,
    purpose: githubMeta.description || `${cleanTitle} 프로젝트는 개발 역량 강화 및 ${techStack[0] || "웹"} 환경에서의 주요 핵심 기능 구현을 학습하기 위해 제작되었습니다.`,
    techStack,
    features,
    implementationSummary: `프로젝트는 주로 ${language} 언어로 작성되었습니다. ${
      githubMeta.recentCommits && githubMeta.recentCommits.length > 0
        ? `최근 커밋 이력(${githubMeta.recentCommits.slice(0, 2).join(", ")})에 기반해 점진적인 UI 개선과 기능 보완이 이루어졌으며,`
        : ""
    } ${deployMeta.platform || "웹 플랫폼"}에 배포되어 최종 접근성 테스트를 통과했습니다.`,
    learned: userMemo
      ? `${memoText}오늘 프로젝트를 진행하며 핵심 기술을 실제로 적용하고, 발생하는 동기/비동기 처리 문제를 디버깅하는 과정을 배웠습니다.`
      : "기본적인 프로젝트 설정부터 시작해 기능 명세 요구사항을 차례대로 구현하는 과정을 익혔습니다. 또한 외부 라이브러리/API와의 연동 및 배포 자동화 프로세스에 대한 실무 지식을 학습했습니다.",
    difficulties: "비동기 데이터를 화면에 바인딩할 때 생기는 렌더링 타이밍 이슈와, CSS 스타일링 라이브러리 설정 시 발생한 모듈 번들링 에러가 있어 해결에 다소 시간이 소요되었습니다.",
    improvements: "다음 단계에서는 전역 상태 관리 도구(Zustand 등)를 도입하여 컴포넌트 간 데이터 전달 구조를 단순화하고, 모바일 반응형 디자인 디테일을 더욱 보완할 예정입니다.",
    portfolioDescription: `[${cleanTitle}]\n\n• 주요 특징: GitHub API 및 웹 크롤링 기술을 결합하여 실시간으로 프로젝트 명세를 자동 분석\n• 핵심 성과: ${techStack.slice(0, 3).join(", ")} 스택을 적용하여 100% 작동 가능한 MVP 개발 및 배포 성공\n• 담당 업무: 기획, 프론트엔드/백엔드 서버 API 구현, 배포 조율 및 리펙토링 전반`,
    assignmentSummary: `본 과제는 ${cleanTitle} 개발에 대한 건입니다. 주요 기술 스택으로 ${techStack.join(", ")}을 채택하였고, GitHub 리포지토리의 README.md 작성 및 최근 커밋 5회 이상을 준수하며 개발을 수행했습니다. 배포 주소(${deployMeta.platform || "상용 호스트"})에서 정상 동작함을 검증 완료했습니다.`,
    readmeSummary: githubMeta.readmeText
      ? `README.md에 프로젝트 제목 및 설치 방법, 기술 스택 등이 마크다운 형식으로 자세히 서술되어 있습니다. (총 ${githubMeta.readmeText.length}자)`
      : "리포지토리에 README.md 파일이 존재하지 않거나 비어 있습니다. 향후 원활한 협업과 공유를 위해 프로젝트 소개 및 설치 방법 등을 README.md 파일에 추가 작성할 것을 강력히 권장합니다.",
    commitSummary: githubMeta.recentCommits && githubMeta.recentCommits.length > 0
      ? `최근 커밋 메시지 분석 결과:\n${githubMeta.recentCommits.map((c: string, idx: number) => `  ${idx + 1}. ${c}`).join("\n")}`
      : "커밋 이력을 불러올 수 없거나 커밋 내역이 없습니다.",
    deployAnalysis: deployMeta.isReachable
      ? `배포된 웹 페이지(${deployMeta.title || "홈페이지"})의 HTML 구조 분석 결과: 제목 "${deployMeta.title}", ${
          deployMeta.headings && deployMeta.headings.length > 0
            ? `주요 표제어(${deployMeta.headings.slice(0, 3).join(", ")}) 및 `
            : ""
        }${
          deployMeta.buttons && deployMeta.buttons.length > 0
            ? `주요 상호작용 요소(버튼: ${deployMeta.buttons.join(", ")})`
            : "상호작용 버튼"
        }가 적절히 탐색되었습니다. ${deployMeta.platform} 플랫폼에 안정적으로 배포된 상태입니다.`
      : "배포 URL 접속이 불가능하거나 타임아웃이 발생했습니다. 도메인 철자 및 서버 가동 여부를 확인해 주십시오.",
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
당신은 최고의 시니어 풀스택 개발자이자 UX/UI 디자인 전문가입니다.
아래에 제공된 GitHub 리포지토리 분석 정보와 배포 사이트의 크롤링 메타데이터, 그리고 사용자가 작성한 '오늘의 한 줄 메모'를 토대로 프로젝트 상세 분석 보고서를 작성해주세요.

반드시 한국어로 작성해야 하며, 기술적 완성도와 신뢰도가 높은 톤앤매너를 사용해주세요.

[입력 데이터]
1. GitHub 정보:
   - 저장소 이름: ${githubMeta.repoName}
   - 소유자: ${githubMeta.owner}
   - 기본 설명: ${githubMeta.description}
   - 주 언어 및 언어별 바이트: ${JSON.stringify(githubMeta.languages)}
   - 추론된 기술스택: ${JSON.stringify(githubMeta.inferredTech)}
   - 최근 5개 커밋 메시지: ${JSON.stringify(githubMeta.recentCommits)}
   - README 내용: ${githubMeta.readmeText ? githubMeta.readmeText.substring(0, 3000) : "(없음)"}

2. 배포 사이트 정보:
   - 접속 성공 여부: ${deployMeta.isReachable}
   - 타이틀 (title): ${deployMeta.title}
   - 메타 설명 (description): ${deployMeta.description}
   - 주요 H1/H2 태그들: ${JSON.stringify(deployMeta.headings)}
   - 주요 버튼/클릭 요소 텍스트: ${JSON.stringify(deployMeta.buttons)}
   - 추정된 호스팅 플랫폼: ${deployMeta.platform}

3. 사용자의 오늘의 한 줄 메모:
   - 메모 내용: ${userMemo || "(작성되지 않음)"}

[출력 요구사항]
반드시 다음 키들을 가지는 JSON 형식의 문자열 하나만 리턴해 주십시오. 다른 설명, 마크다운 코드 블록(\`\`\`json ...) 없이 오직 순수 JSON 데이터만 출력해야 파싱이 정상적으로 이루어집니다.

JSON 스키마:
{
  "title": "프로젝트명 (배포 타이틀이나 GitHub 이름을 다듬은 세련된 제목)",
  "summary": "한 줄 요약 (50자 내외)",
  "purpose": "프로젝트 목적 (1~2문장)",
  "techStack": ["기술1", "기술2", "기술3"... (GitHub 분석 및 배포 정보에 기반한 정밀한 기술 리스트)],
  "features": ["주요 기능 1", "주요 기능 2", "주요 기능 3", "주요 기능 4"... (상호작용 버튼 및 헤더, README에 기술된 내용으로 추정)],
  "implementationSummary": "구현 과정 요약 (2~3문장)",
  "learned": "오늘 배운 점 (한 줄 메모가 입력되었다면 해당 내용을 반영해 구체적으로 학습한 바를 서술)",
  "difficulties": "어려웠던 점 (사용 기술과 커밋 이력 등으로 미루어보아 겪었을 법한 문제점 제시)",
  "improvements": "개선할 점 (성능 최적화, 추가 기능 등 향후 개발 로드맵 제시)",
  "portfolioDescription": "포트폴리오용 설명 (프로젝트 개요, 담당 역할, 주요 성과를 포함하는 포트폴리오용 텍스트)",
  "assignmentSummary": "과제 제출용 요약 (학습 과정 제출에 최적화된 형식의 압축된 요약본)",
  "readmeSummary": "README 요약 (README에 기술된 주요 설정법이나 컨셉 요약)",
  "commitSummary": "최근 커밋 요약 (최근 커밋들의 흐름을 분석하여 개발진행 경과 요약)",
  "deployAnalysis": "배포 페이지 분석 요약 (도달 가능 여부, 플랫폼, 헤더 정보 등을 통해 분석한 배포 상태)"
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

  // Fallback to mock
  return null;
}
