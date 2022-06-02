FROM node:16-buster-slim AS build
ENV NODE_ENV=production
ENV PATH=/usr/share/app/node_modules/.bin:/usr/share/app/node_modules/@vue:$PATH
WORKDIR /usr/share/app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.21 AS production
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/share/app/dist/ .
EXPOSE 80 443

FROM production AS development
ENV DOMAIN=bytes.local

# Create self-signed certificate accepting default input and: custom domain:
RUN openssl req \
  -x509 \
  -nodes \
  -days 365 \
  -subj "/C=AU/ST=TX/O=ACME/CN=${DOMAIN}" \
  -addext "subjectAltName=DNS:${DOMAIN}" \
  -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt

# Diffie-Helman group
RUN openssl dhparam -out /etc/nginx/dhparam.pem 2048
