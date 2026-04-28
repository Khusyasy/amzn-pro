FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

FROM base AS deps
ADD package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS prod-deps
COPY --from=deps /app/node_modules /app/node_modules
ADD package.json pnpm-lock.yaml ./
RUN pnpm prune --prod

FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN DATABASE_URL=postgresql://dummy@localhost:5432/dummy pnpm exec prisma generate
RUN pnpm build

FROM base AS runner
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/generated /app/generated
COPY --from=build /app/.output /app/.output
EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]
