import { describe, expect, it } from "vitest";

import { projects } from "./projects";

describe("projects", () => {
  it("uses the lightweight endpoint for its own health check", () => {
    const dashboard = projects.find((project) => project.id === "live-project-dashboard");

    expect(dashboard?.healthUrl).toBe("http://127.0.0.1:3000/api/health");
  });
});
