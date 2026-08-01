import { Dashboard } from "@/components/dashboard";
import { checkProjects } from "@/lib/health";
import { projects } from "@/lib/projects";

export default async function Home() {
  const health = await checkProjects(projects);
  return <Dashboard initialHealth={health} />;
}
