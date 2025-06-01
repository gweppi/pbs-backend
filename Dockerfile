# Bun to install en build
FROM oven/bun:latest AS bun
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build

# see https://blog.dejangegic.com/smallest-bun-docker-image for this part
# Alpine with compression
FROM alpine:latest AS alpine
RUN apk add upx
COPY --from=bun /usr/local/bin/bun /usr/local/bin/
WORKDIR /usr/local/bin
RUN upx --all-methods bun

# Run step
FROM frolvlad/alpine-glibc
COPY --from=alpine /usr/local/bin/bun /usr/local/bin/
WORKDIR /dist
COPY --from=bun /app/dist .
EXPOSE 8080
CMD [ "bun", "index.js" ]