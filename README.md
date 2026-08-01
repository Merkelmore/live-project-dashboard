# Live Project Dashboard

The dashboard behind [www.leonstrotz.com](https://www.leonstrotz.com) lists Leon Strotz’s public projects and checks whether each public URL can be reached.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The dashboard makes its health requests through `/api/status`, so browsers never make cross-origin checks themselves.

## Adding a project

Edit `src/lib/projects.ts`. The display name and public URL are deliberately separate, and the URL list is static to prevent server-side request forgery. `healthUrl` is available for an explicit public health endpoint when it differs from the page URL.

Status meanings:

- **Live**: the target returned HTTP 2xx or 3xx.
- **Nicht erreichbar**: the target returned HTTP 4xx or 5xx.
- **Unbekannt**: no definitive HTTP answer was received before the timeout (for example DNS, TLS, or network trouble).

This is an availability signal, not a deep application-health test.

## Production

The project joins the existing `cultural-enrichment-radar_default` Docker network and is expected at `/srv/live-project-dashboard`. Before the first deployment, create a protected `.env.production` from `.env.example`, ensure DNS for `www.leonstrotz.com` points to the shared host, and add [Caddyfile.leonstrotz.com](Caddyfile.leonstrotz.com) to the central shared Caddy configuration. The deployment workflow requires the existing repository secrets documented in `AGENTS.md`.
