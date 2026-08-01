"use client";

import { Activity, Boxes, CircleAlert, Wifi } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { ProjectsTable } from "@/components/projects-table";
import type { ProjectHealth } from "@/lib/health";
import { projects } from "@/lib/projects";

type StatusResponse = { projects: ProjectHealth[] };

function healthByProjectId(results: ProjectHealth[]) {
  return Object.fromEntries(results.map((result) => [result.id, result])) as Record<string, ProjectHealth>;
}

export function Dashboard({ initialHealth }: { initialHealth: ProjectHealth[] }) {
  const [health, setHealth] = useState<Record<string, ProjectHealth>>(() => healthByProjectId(initialHealth));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      if (!response.ok) throw new Error("Statusdienst nicht verfügbar");
      const payload = (await response.json()) as StatusResponse;
      setHealth(healthByProjectId(payload.projects));
    } catch {
      setError("Die Statusprüfung konnte gerade nicht geladen werden.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const liveCount = useMemo(() => Object.values(health).filter((item) => item?.status === "live").length, [health]);
  const unavailableCount = useMemo(() => Object.values(health).filter((item) => item?.status === "not_live").length, [health]);

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium tracking-wide text-blue-700">LEON STROTZ</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Live-Projekte</h1>
            <p className="mt-2 max-w-xl text-slate-600">Ein Überblick über alle öffentlichen Projekte und ihre aktuelle Erreichbarkeit.</p>
          </div>
          <p className="text-sm text-slate-500">Erreichbarkeit = HTTP-Antwort, kein Tiefentest</p>
        </header>

        <section aria-label="Kennzahlen" className="mb-6 grid gap-4 sm:grid-cols-3">
          <Metric icon={Boxes} label="Projekte" value={projects.length} tone="slate" />
          <Metric icon={Wifi} label="Erreichbar" value={liveCount} tone="emerald" />
          <Metric icon={CircleAlert} label="Nicht erreichbar" value={unavailableCount} tone="rose" />
        </section>

        {error && <p role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
        <ProjectsTable projects={projects} health={health} isRefreshing={isRefreshing} onRefresh={() => void refresh()} />
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Activity; label: string; value: number; tone: "slate" | "emerald" | "rose" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return <Card className="border-slate-200 py-0 shadow-sm"><CardContent className="flex items-center gap-4 p-5"><span className={`grid size-10 place-items-center rounded-xl ${tones[tone]}`}><Icon className="size-5" /></span><div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-semibold text-slate-950">{value}</p></div></CardContent></Card>;
}
