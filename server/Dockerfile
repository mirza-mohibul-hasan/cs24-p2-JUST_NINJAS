# syntax=docker/dockerfile:1
FROM node:18.19.0-bookworm-slim

WORKDIR /app/backend

# COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]