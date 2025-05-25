FROM node:22-alpine

WORKDIR /app

COPY . .

RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile

RUN pnpm build

EXPOSE 8080

CMD [ "pnpm", "start" ]