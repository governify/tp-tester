FROM node:14 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.19
COPY --from=build /app/dist/my-app /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
