# Live Project Dashboard

The dashboard behind [www.leonstrotz.com](https://www.leonstrotz.com) lists Leon Strotzâ€™s public projects and checks whether each public URL can be reached.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The dashboard makes its health requests through `/api/status`, so browsers never make cross-origin checks themselves.

## Adding a project

Edit `src/lib/projects.ts`. The display name and public URL are deliberately separate (for example, Application Agent is published at `sharemeter.info`), and the URL list is static to prevent server-side request forgery. `healthUrl` is available for an explicit public health endpoint when it differs from the page URL. The dashboard inventories the configured GitHub projects on each refresh, but it only checks curated URLs.

Status meanings:

- **Live**: the target returned HTTP 2xx or 3xx.
- **Nicht erreichbar**: the target returned HTTP 4xx or 5xx.
- **Unbekannt**: no definitive HTTP answer was received before the timeout (for example DNS, TLS, or network trouble).

HTTP 401/403 means the service is reachable but protected, so it appears as **Live Â· geschÃ¼tzt**. This is an availability signal, not a deep application-health test. Projects without a confirmed public URL appear separately at [/not-live](/not-live).

## Production operations

Production is managed explicitly from the private `Merkelmore/production-operations` repository. Merging code does not deploy. The application runs unprivileged behind the central HTTPS gateway and exposes no host port.

A production release requires repository checks, container health, and public dashboard verification. Optional GitHub read access must use a newly issued least-privilege credential stored outside Git.
