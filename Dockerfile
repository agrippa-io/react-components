# syntax=docker/dockerfile:1.7
#
# Multi-stage build for the @agrippa-io/react-components Storybook catalog.
#
#   deps   resolves node_modules with the npm token mounted as a BuildKit
#          secret (never written to a layer).
#   build  compiles the static Storybook site (storybook-static/).
#   serve  the deployable image: nginx serving the static build — no Node,
#          no source, no credentials.
#
# Build for ECR:
#   docker build --secret id=npm_token,src=<token-file> -t <repo>:latest .
# The secret is optional — omit it if every dependency is public.

# Static output: build natively, not under QEMU, for every target platform.
FROM --platform=$BUILDPLATFORM node:24-alpine AS base

# ---- deps: resolve node_modules with the npm token mounted as a secret ----
FROM base AS deps
WORKDIR /usr/local/apps/react-components

COPY package.json yarn.lock ./

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

# ---- build: compile the static Storybook site ----
FROM base AS build
WORKDIR /usr/local/apps/react-components
ENV PATH=/usr/local/apps/react-components/node_modules/.bin:$PATH

COPY --from=deps /usr/local/apps/react-components/node_modules ./node_modules
# Everything else; .dockerignore keeps node_modules, dist/, .git and secrets out.
COPY . .

# `build:storybook` runs `storybook build`, which emits storybook-static/.
RUN yarn build:storybook

# ---- serve: nginx serving the static Storybook build ----
# Serve: the agrippa-web image contract (agrippa-stack
# deploy/charts/agrippa-web/README.md): unprivileged nginx (UID 101) on $PORT
# (4503, the deploy.yaml port), a read-only root filesystem (everything nginx
# writes goes to /tmp) and /healthz for the probes.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS serve

ENV PORT=4503 \
    NGINX_ENVSUBST_OUTPUT_DIR=/tmp \
    NGINX_ENVSUBST_FILTER=^PORT$
USER root
# Patch the base image's Alpine packages (fixed CVEs the 1.27 tag predates;
# the image build's Trivy scan fails on fixable CRITICALs).
RUN apk upgrade --no-cache
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /usr/local/apps/react-components/storybook-static \
     /usr/share/nginx/html
USER 101

EXPOSE 4503
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO /dev/null "http://127.0.0.1:${PORT}/healthz" || exit 1
