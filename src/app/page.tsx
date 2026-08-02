import { Dashboard } from "@/components/dashboard";
import { getProjectInventory } from "@/lib/inventory";

export default async function Home() {
  return <Dashboard initialInventory={await getProjectInventory()} />;
}
