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

RUN PORT=3000 BASE_PATH=/ NODE_ENV=production \
    pnpm --filter @workspace/m-aldbani run build


FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/artifacts/api-server/dist/ ./artifacts/api-server/dist/
COPY --from=builder /app/artifacts/m-aldbani/dist/ ./artifacts/m-aldbani/dist/

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
