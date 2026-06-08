import { ProjectLog, ApiKeys } from "@/types";

const LOGS_STORAGE_KEY = "ai_project_logs";
const KEYS_STORAGE_KEY = "ai_project_keys";

// Default API Keys / Provider settings
const DEFAULT_KEYS: ApiKeys = {
  aiProvider: "mock",
};

export function getApiKeys(): ApiKeys {
  if (typeof window === "undefined") return DEFAULT_KEYS;
  try {
    const stored = localStorage.getItem(KEYS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_KEYS;
  } catch (e) {
    console.error("Failed to load API keys", e);
    return DEFAULT_KEYS;
  }
}

export function saveApiKeys(keys: ApiKeys): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys));
  } catch (e) {
    console.error("Failed to save API keys", e);
  }
}

export function getProjectLogs(): ProjectLog[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!stored) return [];
    
    // Sort by createdAt descending (newest first)
    const logs = JSON.parse(stored) as ProjectLog[];
    return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    console.error("Failed to load project logs", e);
    return [];
  }
}

export function getProjectLogById(id: string): ProjectLog | null {
  const logs = getProjectLogs();
  return logs.find((log) => log.id === id) || null;
}

export function saveProjectLog(log: Omit<ProjectLog, "id" | "createdAt" | "updatedAt"> & { id?: string }): ProjectLog {
  const logs = getProjectLogs();
  const now = new Date().toISOString();
  
  const newLog: ProjectLog = {
    ...log,
    id: log.id || Math.random().toString(36).substring(2, 11),
    createdAt: now,
    updatedAt: now,
  };

  logs.push(newLog);
  if (typeof window !== "undefined") {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  }
  return newLog;
}

export function updateProjectLog(updatedLog: ProjectLog): ProjectLog {
  const logs = getProjectLogs();
  const index = logs.findIndex((log) => log.id === updatedLog.id);
  
  const now = new Date().toISOString();
  const finalLog = {
    ...updatedLog,
    updatedAt: now,
  };

  if (index !== -1) {
    logs[index] = finalLog;
  } else {
    logs.push(finalLog);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  }
  return finalLog;
}

export function deleteProjectLog(id: string): void {
  const logs = getProjectLogs();
  const filtered = logs.filter((log) => log.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(filtered));
  }
}
