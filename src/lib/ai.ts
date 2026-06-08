import { ApiKeys, ProjectLog } from "@/types";

// Dynamic Streamlined Mock Generator for Tech and UX/UI highlights
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

  return {
    title: deployMeta.title || cleanTitle,
    summary: `${cleanTitle}은(는) ${techStack.join(", ")} 기술 스택을 활용해 개발된 프로젝트입니다.`,
    techStack,
    features,
    uxUiAnalysis: deployMeta.isReachable
      ? `배포 사이트 분석 결과: "${deployMeta.title || "홈페이지"}" 타이틀과 함께 ${
          deployMeta.headings && deployMeta.headings.length > 0
            ? `${deployMeta.headings.slice(0, 3).join(", ")} 등의 상단 구조`
            : "일관된 레이아웃"
        }를 갖추고 있습니다. 버튼 및 상호작용 요소(${
          deployMeta.buttons && deployMeta.buttons.length > 0
            ? deployMeta.buttons.join(", ")
            : "인터랙티브 컴포넌트"
        })가 명확하게 배치되어 직관적인 사용성을 제공합니다.`
      : "배포지 상태 체크 실패로 인해 시각 레이아웃 및 상호작용 디자인을 수집하지 못했습니다. 추후 도메인 재가동 후 재시도 바랍니다.",
    improvements: `기술적으로는 컴포넌트의 모듈 분리가 필요하며, UI/UX 측면에서는 다크모드 대응을 위한 시맨틱 컬러 토글 및 모바일 기기에서의 터치 타깃 크기(min 48px)를 보완하면 더욱 완성도 높은 인터페이스가 될 것입니다.`,
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
아래 제공된 GitHub 리포지토리 메타데이터와 배포 사이트 구조를 분석하여 개발자 아카이브용 요약을 작성해 주십시오.

반드시 한국어로 작성해야 하며, 기술적 깊이와 인터페이스 인사이트가 높은 톤앤매너를 사용해 주십시오.

[입력 데이터]
1. GitHub 정보:
   - 저장소 이름: ${githubMeta.repoName}
   - 소유자: ${githubMeta.owner}
   - 기본 설명: ${githubMeta.description}
   - 주 언어: ${githubMeta.language}
   - 추론된 기술스택: ${JSON.stringify(githubMeta.inferredTech)}
   - 최근 5개 커밋: ${JSON.stringify(githubMeta.recentCommits)}
   - README 내용: ${githubMeta.readmeText ? githubMeta.readmeText.substring(0, 2000) : "(없음)"}

2. 배포 사이트 정보:
   - 타이틀 (title): ${deployMeta.title}
   - 메타 설명 (description): ${deployMeta.description}
   - 주요 H1/H2 태그들: ${JSON.stringify(deployMeta.headings)}
   - 주요 버튼/클릭 요소 텍스트: ${JSON.stringify(deployMeta.buttons)}
   - 추정된 호스팅 플랫폼: ${deployMeta.platform}

3. 사용자의 오늘의 한 줄 메모:
   - 메모 내용: ${userMemo || "(없음)"}

[출력 요구사항]
반드시 다음 키들을 가지는 JSON 형식의 문자열 하나만 리턴해 주십시오. 다른 설명, 마크다운 코드 블록(\`\`\`json ...) 없이 오직 순수 JSON 데이터만 출력해야 파싱이 정상적으로 이루어집니다.

JSON 스키마:
{
  "title": "프로젝트명 (배포 타이틀이나 GitHub 이름을 다듬은 세련된 제목)",
  "summary": "한 줄 요약 (50자 내외)",
  "techStack": ["기술1", "기술2", "기술3"... (GitHub 분석 및 배포 정보에 기반한 정밀한 기술 리스트)],
  "features": ["주요 기능 1", "주요 기능 2", "주요 기능 3", "주요 기능 4"... (상호작용 버튼 및 헤더, README에 기술된 내용으로 추정)],
  "uxUiAnalysis": "UX/UI 분석 (배포 사이트의 HTML 구조, 타이틀, 버튼 텍스트 등을 기반으로 한 인터페이스 레이아웃의 장점, 정보 계층의 직관성, 상호작용성 분석. 3문장 내외)",
  "improvements": "기술 및 UI/UX 개선할 점 (반응형 대응, 접근성 가이드라인 준수, 애니메이션 피드백 추가, 컴포넌트 최적화 등 향후 보완 방향. 2~3문장)"
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
