import "server-only";

import { checkProjects, type ProjectHealth } from "@/lib/health";
import { hasPublicUrl, projects, type Project } from "@/lib/projects";
import type { GitHubRepository, InventoryProject, InventoryResponse } from "@/lib/inventory-shared";

const GITHUB_OWNER = "Merkelmore";

async function fetchGitHubRepositories(): Promise<{ repositories: GitHubRepository[]; source: InventoryResponse["githubSource"] }> {
  const token = process.env.GITHUB_READ_TOKEN;
  const fetchRepositories = async (endpoint: string, authorization?: string) => fetch(endpoint, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "live-project-dashboard",
      ...(authorization ? { Authorization: `Bearer ${authorization}` } : {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (token) {
    const authenticated = await fetchRepositories("https://api.github.com/user/repos?affiliation=owner&per_page=100&sort=updated", token);
    if (authenticated.ok) return { repositories: (await authenticated.json()) as GitHubRepository[], source: "authenticated" };
  }
  const publicRepositories = await fetchRepositories(`https://api.github.com/users/${GITHUB_OWNER}/repos?per_page=100&sort=updated`);
  return { repositories: publicRepositories.ok ? (await publicRepositories.json()) as GitHubRepository[] : [], source: "public-fallback" };
}

function mergeCatalog(
  catalog: readonly Project[],
  repositories: readonly GitHubRepository[],
  health: readonly ProjectHealth[],
): InventoryProject[] {
  const repositoryByName = new Map(repositories.map((repository) => [repository.name.toLowerCase(), repository]));
  const healthById = new Map(health.map((result) => [result.id, result]));
  const catalogRepositoryNames = new Set(catalog.map((project) => project.repository.toLowerCase()));
  const configured = catalog.map((project) => ({
    ...project,
    github: repositoryByName.get(project.repository.toLowerCase()) ?? null,
    health: healthById.get(project.id) ?? null,
  }));
  const discovered = repositories
    .filter((repository) => !catalogRepositoryNames.has(repository.name.toLowerCase()))
    .map((repository) => ({
      id: `github-${repository.name.toLowerCase()}`,
      name: repository.name,
      repository: repository.name,
      github: repository,
      health: null,
    }));
  return [...configured, ...discovered];
}

export async function getProjectInventory(): Promise<InventoryResponse> {
  const [github, health] = await Promise.all([
    fetchGitHubRepositories(),
    checkProjects(projects.filter(hasPublicUrl)),
  ]);
  return {
    projects: mergeCatalog(projects, github.repositories, health),
    checkedAt: new Date().toISOString(),
    githubSource: github.source,
  };
}
