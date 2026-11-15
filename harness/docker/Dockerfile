FROM node:26-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Same setup as the dev machine: pnpm as an npm global, used only to bootstrap.
# pnpm 12 reads packageManager in package.json and switches itself to that pinned version.
RUN npm install --global --allow-scripts=pnpm pnpm

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

# First pnpm call inside the repo downloads + activates the packageManager-pinned version
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
