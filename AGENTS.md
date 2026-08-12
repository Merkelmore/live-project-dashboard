# Live Project Dashboard

## Application

- This is a Next.js App Router application using TypeScript, Tailwind CSS, and shadcn/ui.
- Keep the public project register in `src/lib/projects.ts`; URLs must never originate from a user request at runtime.
- Health checks are server-only. A successful check establishes HTTP reachability, not application-level health.

## Production

- Production is managed from the private `Merkelmore/production-operations` repository.
- Pushing or merging code does not deploy. Releases are explicit and use a selected reviewed revision.
- Do not add SSH deployment workflows or commit GitHub tokens, credentials, private keys, or production data.
- The central gateway owns HTTPS. This application exposes only its private Docker port.
- A release must pass lint, tests, a production build, the container health check, and public dashboard verification.
