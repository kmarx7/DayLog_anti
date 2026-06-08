export type ProjectLog = {
  id: string;
  title: string;
  date: string;
  githubUrl: string;
  deployUrl: string;
  userMemo?: string;

  summary: string;
  purpose: string;
  techStack: string[];
  features: string[];
  implementationSummary: string;
  learned: string;
  difficulties: string;
  improvements: string;
  portfolioDescription: string;
  assignmentSummary: string;

  readmeSummary?: string;
  commitSummary?: string;
  deployAnalysis?: string;

  githubMeta?: {
    repoName: string;
    owner: string;
    description?: string;
    defaultBranch?: string;
    language?: string;
    languages?: Record<string, number>;
    recentCommits?: string[];
    updatedAt?: string;
  };

  deployMeta?: {
    title?: string;
    description?: string;
    headings?: string[];
    buttons?: string[];
    platform?: string;
    isReachable: boolean;
  };

  status: "complete" | "github_only" | "deploy_error" | "error";
  createdAt: string;
  updatedAt: string;
};

export type ApiKeys = {
  openaiApiKey?: string;
  geminiApiKey?: string;
  githubToken?: string;
  aiProvider: "openai" | "gemini" | "mock";
};
