FROM node:24-bookworm-slim AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY . .
RUN npm run build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN groupadd --system dashboard && useradd --system --gid dashboard --create-home dashboard

COPY --from=build --chown=dashboard:dashboard /app/public ./public
COPY --from=build --chown=dashboard:dashboard /app/.next/standalone ./
COPY --from=build --chown=dashboard:dashboard /app/.next/static ./.next/static

USER dashboard
EXPOSE 3000
CMD ["node", "server.js"]
