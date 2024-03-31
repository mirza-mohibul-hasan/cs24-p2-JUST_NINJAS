FROM node:18.19.0-bookworm-slim

WORKDIR /app/frontend

# COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]