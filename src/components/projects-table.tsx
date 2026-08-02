"use client";

import { Code, ExternalLink, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inventoryStatus, type InventoryProject, type InventoryStatus } from "@/lib/inventory-shared";

type ProjectsTableProps = { projects: readonly InventoryProject[]; isRefreshing: boolean; onRefresh: () => void };

const statusLabels: Record<InventoryStatus, string> = { live: "Live", protected: "Live · geschützt", not_live: "Nicht live", unknown: "Unbekannt", not_configured: "Keine URL hinterlegt" };
const statusClasses: Record<InventoryStatus, string> = {
  live: "border-emerald-200 bg-emerald-50 text-emerald-700",
  protected: "border-blue-200 bg-blue-50 text-blue-700",
  not_live: "border-rose-200 bg-rose-50 text-rose-700",
  unknown: "border-amber-200 bg-amber-50 text-amber-700",
  not_configured: "border-slate-200 bg-slate-50 text-slate-600",
};

function formatCheckedAt(checkedAt?: string) {
  if (!checkedAt) return "–";
  return new Intl.DateTimeFormat("de-CH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(checkedAt));
}

function statusDetail(project: InventoryProject) {
  if (!project.url) return "Öffentliche URL noch nicht zugeordnet";
  if (!project.health) return "Prüfung ausstehend";
  if (project.health.statusCode) return `HTTP ${project.health.statusCode} · ${project.health.latencyMs ?? "–"} ms`;
  return project.health.latencyMs ? `${project.health.latencyMs} ms · keine Antwort` : "Keine Antwort";
}

export function ProjectsTable({ projects, isRefreshing, onRefresh }: ProjectsTableProps) {
  return <section aria-labelledby="projects-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div><h2 id="projects-heading" className="text-lg font-semibold text-slate-950">Projektinventar</h2><p className="mt-1 text-sm text-slate-500">Der Refresh gleicht GitHub-Metadaten ab und prüft ausschließlich hinterlegte, vertrauenswürdige URLs.</p></div>
      <Button onClick={onRefresh} disabled={isRefreshing} className="w-full sm:w-auto"><RefreshCw className={isRefreshing ? "animate-spin" : ""} />{isRefreshing ? "Inventar aktualisiere …" : "Inventar aktualisieren"}</Button>
    </div>
    <div className="overflow-x-auto"><Table className="min-w-[980px]"><TableHeader><TableRow className="hover:bg-transparent"><TableHead>Projekt</TableHead><TableHead>GitHub</TableHead><TableHead>Öffentliche URL</TableHead><TableHead>Status</TableHead><TableHead>Antwort</TableHead><TableHead>Letzte Prüfung</TableHead></TableRow></TableHeader><TableBody>
      {projects.map((project) => { const status = inventoryStatus(project); return <TableRow key={project.id}>
        <TableCell className="font-medium text-slate-950">{project.url ? <a href={project.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-700 hover:underline">{project.name}<ExternalLink className="size-3.5" aria-hidden="true" /></a> : project.name}</TableCell>
        <TableCell><a href={project.github?.html_url ?? `https://github.com/Merkelmore/${project.repository}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-700 hover:underline"><Code className="size-3.5" aria-hidden="true" />{project.repository}</a></TableCell>
        <TableCell>{project.url ? <a href={project.url} target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-blue-700 hover:underline">{new URL(project.url).hostname}</a> : <span className="text-sm text-slate-400">Nicht hinterlegt</span>}</TableCell>
        <TableCell><Badge variant="outline" className={statusClasses[status]}>{statusLabels[status]}</Badge></TableCell>
        <TableCell className="text-sm text-slate-600">{statusDetail(project)}</TableCell><TableCell className="text-sm text-slate-500">{formatCheckedAt(project.health?.checkedAt)}</TableCell>
      </TableRow>; })}
      {projects.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-slate-500">Keine Projekte in dieser Ansicht.</TableCell></TableRow>}
    </TableBody></Table></div>
  </section>;
}
