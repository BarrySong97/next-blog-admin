FROM gplane/pnpm:latest AS builder

# Create app directory
WORKDIR /app
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install app dependencies
RUN pnpm i
COPY . .

RUN pnpm run build

FROM node:16

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
VOLUME /app/dist
CMD ["echo", "Docker image built"]
