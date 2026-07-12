FROM node:20 AS builder

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY package.json ./
COPY tsconfig.json tsconfig.base.json ./

COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/db/package.json ./lib/db/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/m-aldbani/package.json ./artifacts/m-aldbani/

RUN pnpm install --frozen-lockfile

COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/
COPY artifacts/m-aldbani/ ./artifacts/m-aldbani/
COPY attached_assets/ ./attached_assets/

RUN pnpm --filter @workspace/api-server run build

# NOTE: GOOGLE_CLIENT_ID / APPLE_CLIENT_ID are intentionally NOT passed as
# Vite build-time env vars here. Render's Docker builds don't receive
# dashboard-configured environment variables at build time (see Render's
# "Using Secrets with Docker" docs), so anything read via import.meta.env.VITE_*
# would always bake in as empty on Render. Instead, the server injects these
# public client IDs into index.html at runtime — see app.ts — which works
# identically in every environment. Do not reintroduce VITE_GOOGLE_CLIENT_ID /
# VITE_APPLE_CLIENT_ID as a fix without re-reading this note.
RUN PORT=3000 BASE_PATH=/ NODE_ENV=production \
    pnpm --filter @workspace/m-aldbani run build


FROM node:20 AS runner

WORKDIR /app

COPY --from=builder /app/artifacts/api-server/dist/ ./artifacts/api-server/dist/
COPY --from=builder /app/artifacts/m-aldbani/dist/ ./artifacts/m-aldbani/dist/

ENV NODE_ENV=production
# PORT is injected by the hosting platform (Render injects PORT=5000 by default).
# Do NOT hardcode PORT here so the platform value always wins.

EXPOSE 5000

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
