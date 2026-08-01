# Live Project Dashboard

## Application

- This is a Next.js App Router application using TypeScript, Tailwind CSS, and shadcn/ui.
- Keep the public project register in `src/lib/projects.ts`; URLs must never originate from a user request at runtime.
- Health checks are server-only. A successful check establishes HTTP reachability, not application-level health.

## Deployment

Read https://github.com/Merkelmore/demografie-schweiz/blob/master/docs/gg-deployment.md before touching deployment files.

Pushing to `master` deploys production. Check `GG_GITHUB_TOKEN` before starting and stage explicit paths only. The production deployment expects `/srv/live-project-dashboard`, an `.env.production` file, a DNS A record for `www.leonstrotz.com`, and the existing shared Caddy network.
