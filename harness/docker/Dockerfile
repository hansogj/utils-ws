FROM node:26-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install --global corepack@latest --force
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

# corepack reads packageManager from package.json and activates the right pnpm
RUN corepack install
RUN pnpm --version && node -v

RUN pnpm config set store-dir /pnpm/store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

RUN pnpm deploy --filter=web-js --prod /prod/web-js
RUN pnpm deploy --filter=web-ts --prod /prod/web-ts
RUN pnpm deploy --filter=web-cs --prod /prod/web-cs

FROM node:26-slim AS web-js
COPY --from=build /prod/web-js /prod/web-js
WORKDIR /prod/web-js
EXPOSE 2112
CMD ["node", "node_modules/http-server/bin/http-server", "-p", "2112", "dist"]

FROM node:26-slim AS web-ts
COPY --from=build /prod/web-ts /prod/web-ts
WORKDIR /prod/web-ts
EXPOSE 3113
CMD ["node", "node_modules/http-server/bin/http-server", "-p", "3113", "dist"]

FROM node:26-slim AS web-cs
COPY --from=build /prod/web-cs /prod/web-cs
WORKDIR /prod/web-cs
EXPOSE 4114
CMD ["node", "node_modules/http-server/bin/http-server", "-p", "4114", "dist"]
