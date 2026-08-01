"use client";

import { ExternalLink, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProjectHealth } from "@/lib/health";
import type { Project } from "@/lib/projects";

type ProjectsTableProps = {
  projects: readonly Project[];
  health: Record<string, ProjectHealth>;
  isRefreshing: boolean;
  onRefresh: () => void;
};

const statusLabels = {
  live: "Live",
  not_live: "Nicht erreichbar",
  unknown: "Unbekannt",
} as const;

const statusClasses = {
  live: "border-emerald-200 bg-emerald-50 text-emerald-700",
  not_live: "border-rose-200 bg-rose-50 text-rose-700",
  unknown: "border-amber-200 bg-amber-50 text-amber-700",
} as const;

function formatCheckedAt(checkedAt?: string) {
  if (!checkedAt) return "Noch nicht geprüft";
  return new Intl.DateTimeFormat("de-CH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(checkedAt));
}

function statusDetail(health?: ProjectHealth) {
  if (!health) return "Prüfung ausstehend";
  if (health.statusCode) return `HTTP ${health.statusCode} · ${health.latencyMs ?? "–"} ms`;
  return health.latencyMs ? `${health.latencyMs} ms · keine Antwort` : "Keine Antwort";
}

export function ProjectsTable({ projects, health, isRefreshing, onRefresh }: ProjectsTableProps) {
  return (
    <section aria-labelledby="projects-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 id="projects-heading" className="text-lg font-semibold text-slate-950">Projektübersicht</h2>
          <p className="mt-1 text-sm text-slate-500">Öffentliche URLs werden direkt vom Server geprüft.</p>
        </div>
        <Button onClick={onRefresh} disabled={isRefreshing} className="w-full sm:w-auto">
          <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Aktualisiere …" : "Status aktualisieren"}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Projekt</TableHead>
              <TableHead>Öffentliche URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Antwort</TableHead>
              <TableHead>Letzte Prüfung</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const projectHealth = health[project.id];
              const status = projectHealth?.status ?? "unknown";
              return (
                <TableRow key={project.id}>
                  <TableCell className="font-medium text-slate-950">
                    <a href={project.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-700 hover:underline">
                      {project.name}<ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={project.url} target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-blue-700 hover:underline">
                      {new URL(project.url).hostname}
                    </a>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={statusClasses[status]}>{statusLabels[status]}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-600">{statusDetail(projectHealth)}</TableCell>
                  <TableCell className="text-sm text-slate-500">{formatCheckedAt(projectHealth?.checkedAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
