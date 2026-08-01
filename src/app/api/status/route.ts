import { checkProjects } from "@/lib/health";
import { projects } from "@/lib/projects";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const status = await checkProjects(projects);
  return Response.json(
    { projects: status, checkedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
