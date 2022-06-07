FROM node:16-buster-slim AS development
ENV NODE_ENV=development
WORKDIR /usr/share/app
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "serve"]

FROM development AS build
ENV NODE_ENV=production

ARG DOMAIN_NAME
ENV VUE_APP_BASE_URL=$DOMAIN_NAME

ARG MAX_FILE_SIZE
ENV VUE_APP_MAX_FILE_SIZE=$MAX_FILE_SIZE

ARG UPLOAD_CHUNK_SIZE
ENV VUE_APP_UPLOAD_CHUNK_SIZE=$UPLOAD_CHUNK_SIZE

ARG SW_PING_INTERVAL
ENV VUE_APP_SW_PING_INTERVAL=$SW_PING_INTERVAL

COPY . .
RUN npm run build

FROM nginx:1.21 AS production
WORKDIR /usr/share/nginx/html
EXPOSE 80 443
COPY --from=build /usr/share/app/dist/ .
CMD ["nginx", "-g", "daemon off;"]

FROM production AS https-dev
ARG DOMAIN_NAME
RUN openssl req \
  -x509 \
  -nodes \
  -days 365 \
  -subj "/C=AU/ST=TX/O=ACME/CN=${DOMAIN_NAME}" \
  -addext "subjectAltName=DNS:${DOMAIN_NAME}" \
  -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt
RUN openssl dhparam -out /etc/nginx/dhparam.pem 2048
