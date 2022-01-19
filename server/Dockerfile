### BASE ###

FROM node:16-buster-slim AS base

WORKDIR /app

ENV PATH=/app/node_modules/.bin:$PATH
ENV NODE_ENV=development

EXPOSE 3000

COPY package*.json ./

RUN npm ci && npm cache clean --force


### DEVELOPMENT ###

FROM base AS development

COPY . .

RUN npm install --development

CMD ["nodemon", "src/app.ts", "|", "bunyan", "-o", "short"]


### TEST ###

FROM development AS test
CMD ["jest"]


### BUILD ###

FROM development AS build

ENV NODE_ENV=production

RUN npm run build


### PRODUCTION ###

FROM base AS production

ENV NODE_ENV=production

RUN apt-get update && \
    apt-get install tini --no-recommends && \
    rm -rf /var/lib/apt/lists*

COPY --from=build /app/build ./

USER node

ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["node", "app.js"]