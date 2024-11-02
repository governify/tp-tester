FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN apk add --no-cache git
CMD ["npm", "run", "server"]
