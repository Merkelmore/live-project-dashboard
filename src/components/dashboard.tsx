"use client";

import { Activity, Boxes, CircleAlert, Code, Wifi } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { ProjectsTable } from "@/components/projects-table";
import { Card, CardContent } from "@/components/ui/card";
import { isReachable, type InventoryResponse } from "@/lib/inventory-shared";

type DashboardProps = { initialInventory: InventoryResponse; view?: "all" | "not-live" };

export function Dashboard({ initialInventory, view = "all" }: DashboardProps) {
  const [inventory, setInventory] = useState(initialInventory);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      if (!response.ok) throw new Error("Statusdienst nicht verfügbar");
      setInventory((await response.json()) as InventoryResponse);
    } catch {
      setError("GitHub-Inventar und Statusprüfung konnten gerade nicht geladen werden.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const reachableCount = useMemo(() => inventory.projects.filter(isReachable).length, [inventory]);
  const unavailable = useMemo(() => inventory.projects.filter((project) => !isReachable(project)), [inventory]);
  const displayedProjects = view === "not-live" ? unavailable : inventory.projects;
  const repositoryCount = useMemo(() => new Set(inventory.projects.map((project) => project.repository.toLowerCase())).size, [inventory]);

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium tracking-wide text-blue-700">LEON STROTZ</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{view === "not-live" ? "Nicht live & ohne URL" : "Live-Projekte"}</h1>
            <p className="mt-2 max-w-2xl text-slate-600">GitHub-Inventar und Erreichbarkeitscheck für alle bekannten Projekte. Ein HTTP 401/403 zählt als erreichbar, aber geschützt.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Code className="size-4" aria-hidden="true" />
            <span>{inventory.githubSource === "authenticated" ? "GitHub-Inventar aktuell" : "Nur öffentliche GitHub-Daten verfügbar"}</span>
          </div>
        </header>

        <section aria-label="Kennzahlen" className="mb-6 grid gap-4 sm:grid-cols-3">
          <Metric icon={Boxes} label="GitHub-Projekte" value={repositoryCount} tone="slate" />
          <Metric icon={Wifi} label="Erreichbar" value={reachableCount} tone="emerald" />
          <Metric icon={CircleAlert} label="Nicht live / ohne URL" value={unavailable.length} tone="rose" />
        </section>

        <nav className="mb-4 flex gap-4 text-sm font-medium">
          <Link href="/" className={view === "all" ? "text-blue-700" : "text-slate-600 hover:text-blue-700"}>Alle Projekte</Link>
          <Link href="/not-live" className={view === "not-live" ? "text-blue-700" : "text-slate-600 hover:text-blue-700"}>Nicht live / ohne URL</Link>
        </nav>
        {error && <p role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
        <ProjectsTable projects={displayedProjects} isRefreshing={isRefreshing} onRefresh={() => void refresh()} />
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Activity; label: string; value: number; tone: "slate" | "emerald" | "rose" }) {
  const tones = { slate: "bg-slate-100 text-slate-700", emerald: "bg-emerald-100 text-emerald-700", rose: "bg-rose-100 text-rose-700" };
  return <Card className="border-slate-200 py-0 shadow-sm"><CardContent className="flex items-center gap-4 p-5"><span className={`grid size-10 place-items-center rounded-xl ${tones[tone]}`}><Icon className="size-5" /></span><div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-semibold text-slate-950">{value}</p></div></CardContent></Card>;
}
