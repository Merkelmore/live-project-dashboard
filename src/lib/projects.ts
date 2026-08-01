/**
 * Single source of truth for the projects shown on the public dashboard.
 * Add a project here rather than accepting URLs from a request at runtime.
 */
export type Project = {
  id: string;
  name: string;
  url: string;
  healthUrl?: string;
};

export const projects: readonly Project[] = [
  {
    id: "cultural-enrichment-radar",
    name: "Cultural Enrichment Radar",
    url: "https://enrichment-radar-schweiz.info",
  },
  {
    id: "gg-orchestrator",
    name: "GG Orchestrator",
    url: "https://strotzenheim.com",
  },
  {
    id: "binance-trade-console",
    name: "Binance Trade Console",
    url: "https://supercomputer.blog",
  },
  {
    id: "sharemeter",
    name: "Sharemeter",
    url: "https://sharemeter.info",
  },
];
