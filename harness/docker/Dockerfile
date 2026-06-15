FROM node:25-slim AS base

ENV NODE_VERSION=25.3.0
ENV PNPM_VERSION=10.33.0

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install --global corepack@latest --force
RUN corepack enable
RUN corepack prepare pnpm@$PNPM_VERSION --activate
RUN pnpm --version
RUN node -v

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN pnpm config set store-dir ~/.pnpm-store

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --force
RUN pnpm run -r build

ENV PATH="./node_modules/.bin:$PATH"

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm add webpack webpack-dev-server -g

RUN pnpm run -r build

RUN pnpm deploy --filter=web-js --prod /prod/web-js
RUN pnpm deploy --filter=web-ts --prod /prod/web-ts
RUN pnpm deploy --filter=web-cs --prod /prod/web-cs

FROM base AS web-js
COPY --from=build /prod/web-js /prod/web-js
WORKDIR /prod/web-js
EXPOSE 2112
CMD [ "pnpm", "start" ]

FROM base AS web-ts
COPY --from=build /prod/web-ts /prod/web-ts
WORKDIR /prod/web-ts
EXPOSE 3113
CMD [ "pnpm", "start" ]

FROM base AS web-cs
COPY --from=build /prod/web-cs /prod/web-cs
WORKDIR /prod/web-cs
EXPOSE 4114
CMD [ "pnpm", "start" ]
