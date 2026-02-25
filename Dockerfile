# Build step
FROM oven/bun:alpine AS build
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build

# Run step
FROM oven/bun:alpine
WORKDIR /dist
COPY --from=build /app/dist .

# Downloads chrome so puppeteer can use it
RUN apk add chromium

EXPOSE 8080
CMD [ "bun", "index.js" ]
