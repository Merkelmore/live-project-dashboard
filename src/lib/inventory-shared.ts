import type { ProjectHealth, HealthStatus } from "@/lib/health";
import type { Project } from "@/lib/projects";

export type GitHubRepository = {
  name: string;
  html_url: string;
  private: boolean;
  archived: boolean;
  updated_at: string;
};

export type InventoryProject = Project & {
  github: GitHubRepository | null;
  health: ProjectHealth | null;
};

export type InventoryResponse = {
  projects: InventoryProject[];
  checkedAt: string;
  githubSource: "authenticated" | "public-fallback";
};

export type InventoryStatus = HealthStatus | "not_configured";

export function inventoryStatus(project: InventoryProject): InventoryStatus {
  return project.health?.status ?? "not_configured";
}

export function isReachable(project: InventoryProject) {
  const status = inventoryStatus(project);
  return status === "live" || status === "protected";
}
