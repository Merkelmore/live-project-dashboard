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

The project joins the existing `cultural-enrichment-radar_default` Docker network and deploys to `/srv/live-project-dashboard`. The production workflow bootstraps the checkout, creates the protected environment file, and adds [Caddyfile.leonstrotz.com](Caddyfile.leonstrotz.com) to the shared Caddy configuration on its first successful run. It requires the existing `DEPLOY_USER` and `DEPLOY_PASSWORD` repository secrets documented in `AGENTS.md`.
