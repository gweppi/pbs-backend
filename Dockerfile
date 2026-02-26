FROM node:24-alpine

#Install version of chrome corresponding with puppeteer-core
RUN apk update && apk upgrade
RUN apk add chromium

WORKDIR /app
COPY . .

RUN npm install --frozen-lockfile
RUN npm run build

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
