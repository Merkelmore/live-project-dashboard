import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { checkProject, checkProjects } from "./health";

const project = { id: "test", name: "Test", url: "https://example.test" };
const fixedNow = () => new Date("2026-08-01T12:00:00.000Z");

describe("checkProject", () => {
  it("marks successful and redirect responses as live", async () => {
    const check = (status: number) => checkProject(project, { fetchImpl: async () => new Response(null, { status }), now: fixedNow });
    await expect(check(200)).resolves.toMatchObject({ status: "live", statusCode: 200 });
    await expect(check(302)).resolves.toMatchObject({ status: "live", statusCode: 302 });
  });

  it("marks HTTP failures as not live", async () => {
    await expect(checkProject(project, { fetchImpl: async () => new Response(null, { status: 503 }), now: fixedNow }))
      .resolves.toMatchObject({ status: "not_live", statusCode: 503 });
  });

  it("reports transport failures as unknown without blocking other projects", async () => {
    const results = await checkProjects([project, { ...project, id: "other", url: "https://other.test" }], {
      fetchImpl: async (url) => {
        if (url.includes("example")) throw new TypeError("DNS failure");
        return new Response(null, { status: 200 });
      },
      now: fixedNow,
    });
    expect(results).toHaveLength(2);
    expect(results[0].status).toBe("unknown");
    expect(results[1].status).toBe("live");
  });

  it("reports an aborted request as unknown", async () => {
    await expect(checkProject(project, {
      fetchImpl: async () => { throw new DOMException("Timed out", "TimeoutError"); },
      now: fixedNow,
    })).resolves.toMatchObject({ status: "unknown", statusCode: null });
  });
});
