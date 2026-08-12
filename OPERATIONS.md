# Production operations

## Service

- Public site: https://www.leonstrotz.com
- Hosting: Hetzner server `general`
- Deployment: reviewed Git revision built with `docker-compose.production.yml`
- Public gateway: the shared Caddy service from the private
  `production-operations` repository

## Secrets

An optional read-only GitHub token is stored only in
`/etc/production-secrets/project-dashboard.env`. The dashboard must still
start with public-only metadata when that token is absent.

## Health check

`/api/status` and the public homepage must return HTTP 200. Repository
failures should be shown as unavailable data rather than crash the site.

## Backup

The application has no irreplaceable local database. Back up the reviewed Git
revision and the non-secret operations record. Recreate the runtime secret from
the provider's protected secret store when necessary.

## Rollback

Redeploy the previous reviewed Git revision and recheck `/api/status` and the
public homepage.
