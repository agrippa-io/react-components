FROM node:18 as base

FROM base as build
# Create app directory
WORKDIR /usr/local/apps/react-components

# Get Arguments
ARG NPM_TOKEN

# Include node modules installed from app in the terminal
ENV PATH=/usr/local/apps/react-components/node_modules/.bin:$PATH

# Copy build Dependencies
COPY package*.json ./
COPY tsconfig.json ./

# Bundle App Source Code
COPY .storybook ./.storybook
COPY public ./public
COPY src ./src

# Apply NPM_TOKEN for installation of private repositories
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> .npmrc
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> .yarnrc

# Install Dependencies
RUN yarn && yarn cache clean
