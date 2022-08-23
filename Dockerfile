# ---- Base Node ----
FROM node:16-alpine as base_image

WORKDIR /app

# ---- Dependencies ----
FROM base_image AS base_modules
# Upgrade npm before continuing
RUN npm install -g npm
COPY package.json package-lock.json ./
RUN npm install

# ---- Copy Files/Build ----
FROM base_image AS build_files
WORKDIR /app
COPY . /app

# ---- Copy Files/Build ----
FROM base_image AS assembled_image
WORKDIR /app
COPY --from=base_modules /app ./
COPY --from=build_files /app ./

# --- Release with Alpine ----
FROM assembled_image AS prod_image
WORKDIR /app
CMD [ "node", "src/", "index.js" ]