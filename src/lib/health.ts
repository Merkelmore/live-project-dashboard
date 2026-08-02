import "server-only";

import type { Project } from "@/lib/projects";

export type HealthStatus = "live" | "protected" | "not_live" | "unknown";

export type ProjectHealth = {
  id: string;
  status: HealthStatus;
  statusCode: number | null;
  latencyMs: number | null;
  checkedAt: string;
};

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

type CheckOptions = {
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  now?: () => Date;
};

const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_CONCURRENCY = 3;

function targetFor(project: Project & { url: string }) {
  return project.healthUrl ?? project.url;
}

function statusForHttpCode(statusCode: number): HealthStatus {
  if (statusCode >= 200 && statusCode < 400) return "live";
  // A login wall still proves that the public service is running. This makes
  // protected projects such as Application Agent visible as reachable.
  if (statusCode === 401 || statusCode === 403) return "protected";
  return "not_live";
}

export async function checkProject(
  project: Project & { url: string },
  { fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS, now = () => new Date() }: CheckOptions = {},
): Promise<ProjectHealth> {
  const startedAt = performance.now();
  const checkedAt = now().toISOString();

  try {
    const response = await fetchImpl(targetFor(project), {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });

    return {
      id: project.id,
      status: statusForHttpCode(response.status),
      statusCode: response.status,
      latencyMs: Math.round(performance.now() - startedAt),
      checkedAt,
    };
  } catch {
    return {
      id: project.id,
      // A transport failure cannot distinguish an offline service from a
      // temporary DNS, TLS, or network problem. Reserve "not_live" for a
      // definitive HTTP error response.
      status: "unknown",
      statusCode: null,
      latencyMs: Math.round(performance.now() - startedAt),
      checkedAt,
    };
  }
}

async function mapWithConcurrency<T, R>(
  values: readonly T[],
  concurrency: number,
  mapper: (value: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      results[index] = await mapper(values[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker));
  return results;
}

export function checkProjects(
  projectList: readonly (Project & { url: string })[],
  options: CheckOptions & { concurrency?: number } = {},
) {
  const { concurrency = DEFAULT_CONCURRENCY, ...checkOptions } = options;
  return mapWithConcurrency(projectList, concurrency, (project) => checkProject(project, checkOptions));
}
