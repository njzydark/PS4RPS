# base image
FROM node:14 as build

WORKDIR /app

COPY . .

RUN npm i -g pnpm && ELECTRON_SKIP_BINARY_DOWNLOAD=true pnpm i --filter web...
RUN pnpm run web:build

FROM nginx:1.21.0

WORKDIR /usr/share/nginx/html

COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]