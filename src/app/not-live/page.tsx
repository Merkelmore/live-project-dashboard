import { Dashboard } from "@/components/dashboard";
import { getProjectInventory } from "@/lib/inventory";

export default async function NotLivePage() {
  return <Dashboard initialInventory={await getProjectInventory()} view="not-live" />;
}
