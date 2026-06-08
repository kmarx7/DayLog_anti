import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { generateAiAnalysis, generateMockAnalysis } from "@/lib/ai";
import { ApiKeys, ProjectLog } from "@/types";

function parseGithubUrl(url: string) {
  try {
    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }
    const parsed = new URL(cleanUrl);
    if (!parsed.hostname.includes("github.com")) return null;
    
    // Path looks like /owner/repo/something
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    
    return {
      owner: parts[0],
      repo: parts[1].replace(/\.git$/, ""),
    };
  } catch {
    return null;
  }
}

async function fetchGithubMeta(owner: string, repo: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "AI-Project-Logbook-App",
  };
  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  const fetchWithTimeout = async (url: string, options: any, timeoutMs = 8000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  };

  // 1. Repo info
  const repoRes = await fetchWithTimeout(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) {
    throw new Error(`Failed to fetch repo info: ${repoRes.statusText} (${repoRes.status})`);
  }
  const repoData = await repoRes.json();

  // 2. Languages
  let languages: Record<string, number> = {};
  try {
    const langRes = await fetchWithTimeout(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
    if (langRes.ok) {
      languages = await langRes.json();
    }
  } catch (e) {
    console.error("Error fetching languages", e);
  }

  // 3. Recent commits
  let recentCommits: string[] = [];
  try {
    const commitsRes = await fetchWithTimeout(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,
      { headers }
    );
    if (commitsRes.ok) {
      const commitsData = await commitsRes.json();
      recentCommits = commitsData.map((c: any) => c.commit?.message || "");
    }
  } catch (e) {
    console.error("Error fetching commits", e);
  }

  // 4. README
  let readmeText = "";
  try {
    const readmeRes = await fetchWithTimeout(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      if (readmeData.content) {
        readmeText = Buffer.from(readmeData.content, "base64").toString("utf-8");
      }
    }
  } catch (e) {
    console.error("Error fetching readme", e);
  }

  // 5. package.json for tech stack inference
  let packageJson: any = null;
  try {
    const pkgRes = await fetchWithTimeout(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, { headers });
    if (pkgRes.ok) {
      const pkgData = await pkgRes.json();
      if (pkgData.content) {
        const pkgText = Buffer.from(pkgData.content, "base64").toString("utf-8");
        packageJson = JSON.parse(pkgText);
      }
    }
  } catch (e) {
    // package.json might not exist, ignore
  }

  // Extract tech stack from package.json if available
  const inferredTech: string[] = [];
  if (packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const techKeywords = [
      "react", "next", "vue", "angular", "svelte", "typescript", "tailwindcss",
      "sass", "express", "nestjs", "fastify", "prisma", "sequelize", "supabase",
      "firebase", "mongodb", "postgresql", "redux", "recoil", "zustand", "tanstack",
      "vite", "webpack", "axios", "graphql", "apollo", "three.js", "framer-motion"
    ];
    for (const dep of Object.keys(deps)) {
      const match = techKeywords.find((k) => dep.toLowerCase().includes(k));
      if (match) {
        const formatted =
          match === "typescript"
            ? "TypeScript"
            : match === "tailwindcss"
            ? "Tailwind CSS"
            : match === "next"
            ? "Next.js"
            : match === "react"
            ? "React"
            : match.charAt(0).toUpperCase() + match.slice(1);
        if (!inferredTech.includes(formatted)) {
          inferredTech.push(formatted);
        }
      }
    }
  }

  return {
    repoName: repoData.name,
    owner: repoData.owner.login,
    description: repoData.description || "",
    defaultBranch: repoData.default_branch,
    language: repoData.language || "",
    languages,
    recentCommits,
    updatedAt: repoData.updated_at,
    readmeText,
    inferredTech,
  };
}

async function fetchDeployMeta(url: string) {
  let absoluteUrl = url.trim();
  if (!/^https?:\/\//i.test(absoluteUrl)) {
    absoluteUrl = `https://${absoluteUrl}`;
  }

  // Detect platform
  let platform = "Other";
  const lowerUrl = absoluteUrl.toLowerCase();
  if (lowerUrl.includes("vercel.app")) platform = "Vercel";
  else if (lowerUrl.includes("netlify.app")) platform = "Netlify";
  else if (lowerUrl.includes("github.io")) platform = "GitHub Pages";

  try {
    const res = await fetch(absoluteUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!res.ok) {
      return {
        title: "",
        description: "",
        headings: [],
        buttons: [],
        platform,
        isReachable: false,
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $("title").text().trim() || "";

    let description = $('meta[name="description"]').attr("content") || "";
    if (!description) {
      description = $('meta[property="og:description"]').attr("content") || "";
    }
    description = description.trim();

    const headings: string[] = [];
    $("h1, h2").each((_, el) => {
      const text = $(el).text().trim();
      if (text && headings.length < 8) {
        headings.push(text);
      }
    });

    const buttons: string[] = [];
    $("button, a.btn, a.button").each((_, el) => {
      const text = $(el).text().trim();
      if (text && buttons.length < 5) {
        buttons.push(text);
      }
    });

    return {
      title,
      description,
      headings,
      buttons,
      platform,
      isReachable: true,
    };
  } catch (e) {
    console.error("Deploy fetch failed:", e);
    return {
      title: "",
      description: "",
      headings: [],
      buttons: [],
      platform,
      isReachable: false,
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { githubUrl, deployUrl, userMemo, apiKeys } = body as {
      githubUrl: string;
      deployUrl: string;
      userMemo?: string;
      apiKeys: ApiKeys;
    };

    if (!githubUrl) {
      return NextResponse.json({ error: "GitHub Repository URL is required." }, { status: 400 });
    }

    // 1. Parse GitHub URL
    const githubInfo = parseGithubUrl(githubUrl);
    if (!githubInfo) {
      return NextResponse.json({ error: "Invalid GitHub Repository URL." }, { status: 400 });
    }

    // 2. Fetch data in parallel
    let githubMeta: any = null;
    let githubError = false;
    try {
      githubMeta = await fetchGithubMeta(githubInfo.owner, githubInfo.repo, apiKeys?.githubToken);
    } catch (e) {
      console.error("GitHub metadata fetching failed:", e);
      githubError = true;
    }

    let deployMeta: any = { isReachable: false, platform: "Other" };
    if (deployUrl) {
      deployMeta = await fetchDeployMeta(deployUrl);
    }

    // If GitHub API totally failed, we can't do much analysis, but we can try to return error status
    if (githubError || !githubMeta) {
      return NextResponse.json({
        error: "Failed to access GitHub repository. Please make sure the repository is public or you have provided a valid GitHub Token in the settings.",
        status: "error"
      }, { status: 500 });
    }

    // 3. AI Analysis or Mock
    let analysisResult: any = null;
    if (apiKeys && apiKeys.aiProvider !== "mock") {
      analysisResult = await generateAiAnalysis(githubMeta, deployMeta, userMemo, apiKeys);
    }

    // Fallback if AI analysis returned null or mock was selected
    if (!analysisResult) {
      analysisResult = generateMockAnalysis(githubMeta.repoName, githubMeta, deployMeta, userMemo);
    }

    // 4. Construct final ProjectLog object (without id/date, generated on client or server save)
    const logResult = {
      title: analysisResult.title || githubMeta.repoName,
      summary: analysisResult.summary || "",
      purpose: analysisResult.purpose || "",
      techStack: analysisResult.techStack || githubMeta.inferredTech || [],
      features: analysisResult.features || [],
      implementationSummary: analysisResult.implementationSummary || "",
      learned: analysisResult.learned || "",
      difficulties: analysisResult.difficulties || "",
      improvements: analysisResult.improvements || "",
      portfolioDescription: analysisResult.portfolioDescription || "",
      assignmentSummary: analysisResult.assignmentSummary || "",
      
      readmeSummary: analysisResult.readmeSummary || "",
      commitSummary: analysisResult.commitSummary || "",
      deployAnalysis: analysisResult.deployAnalysis || "",

      githubMeta: {
        repoName: githubMeta.repoName,
        owner: githubMeta.owner,
        description: githubMeta.description,
        defaultBranch: githubMeta.defaultBranch,
        language: githubMeta.language,
        languages: githubMeta.languages,
        recentCommits: githubMeta.recentCommits,
        updatedAt: githubMeta.updatedAt,
      },
      deployMeta: {
        title: deployMeta.title,
        description: deployMeta.description,
        headings: deployMeta.headings,
        buttons: deployMeta.buttons,
        platform: deployMeta.platform,
        isReachable: deployMeta.isReachable,
      },
      status: deployMeta.isReachable ? "complete" : "deploy_error" as any,
    };

    return NextResponse.json(logResult);
  } catch (error: any) {
    console.error("Analysis route error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
