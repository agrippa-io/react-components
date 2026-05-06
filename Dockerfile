# syntax=docker/dockerfile:1.7
#
# Multi-stage build. Stage 1 installs dependencies with NPM_TOKEN mounted as a
# BuildKit secret (never written to a layer). Stage 2 copies the resolved
# node_modules into a clean image alongside the source — so the published
# image carries the dependency tree but not the credentials used to fetch it.

FROM node:24 AS base

# ---- deps: resolve node_modules with the npm token mounted as a secret ----
FROM base AS deps
WORKDIR /usr/local/apps/react-components

COPY package*.json ./

# The token file lives only in tmpfs at /run/secrets/npm_token during this
# RUN. It is never copied into the layer. .npmrc is created from it, used by
# yarn install, and removed before the layer is committed.
RUN --mount=type=secret,id=npm_token \
    if [ -s /run/secrets/npm_token ]; then \
      echo "//registry.npmjs.org/:_authToken=$(cat /run/secrets/npm_token)" > .npmrc; \
    fi && \
    yarn install --frozen-lockfile && \
    yarn cache clean && \
    rm -f .npmrc

# ---- build: assemble the final image from the resolved deps + source ----
FROM base AS build
WORKDIR /usr/local/apps/react-components
ENV PATH=/usr/local/apps/react-components/node_modules/.bin:$PATH

COPY --from=deps /usr/local/apps/react-components/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json ./
COPY .storybook ./.storybook
COPY public ./public
COPY src ./src
