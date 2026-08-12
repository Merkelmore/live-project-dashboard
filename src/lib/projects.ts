/**
 * Known GitHub projects. URLs are deliberately curated: GitHub repository
 * contents are never treated as runtime fetch targets, avoiding SSRF through a
 * compromised README or deployment file.
 */
export type Project = {
  id: string;
  name: string;
  repository: string;
  url?: string;
  healthUrl?: string;
};

export const projects: readonly Project[] = [
  { id: "live-project-dashboard", name: "Live Project Dashboard", repository: "live-project-dashboard", url: "https://www.leonstrotz.com", healthUrl: "http://127.0.0.1:3000/api/health" },
  { id: "cultural-enrichment-radar", name: "Cultural Enrichment Radar", repository: "demografie-schweiz", url: "https://enrichment-radar-schweiz.info" },
  { id: "gg-orchestrator", name: "GG Orchestrator", repository: "garden-gnome-orchestrator", url: "https://strotzenheim.com" },
  { id: "binance-trade-console", name: "Binance Trade Console", repository: "binance-trade-console", url: "https://supercomputer.blog" },
  { id: "politik-kompass-schweiz", name: "Politik-Kompass Schweiz", repository: "demografie-schweiz", url: "https://politik-kompass-schweiz.info" },
  { id: "application-agent", name: "Application Agent", repository: "Share-Marketplace", url: "https://sharemeter.info" },
  { id: "group-bluetooth-checker", name: "Group Bluetooth Checker", repository: "Group-Bluetooth-checker" },
  { id: "smartme", name: "SmartMe", repository: "SmartMe" },
  { id: "pilz-app", name: "Pilz-App", repository: "Pilz-App" },
  { id: "freelance-website", name: "Freelance Website", repository: "Freelance-Website" },
  { id: "website-mui", name: "Website MUI", repository: "website-mui" },
];

export function hasPublicUrl(project: Project): project is Project & { url: string } {
  return Boolean(project.url);
}
