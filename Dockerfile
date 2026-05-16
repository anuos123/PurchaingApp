FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

RUN npm install && \
    cd server && npm install && \
    cd ../client && npm install && \
    cd .. && npm run build

COPY server/ ./server/
COPY client/dist ./client/dist/
COPY api/ ./api/
COPY client/public ./client/public/

ENV PORT=3000

EXPOSE 3000

CMD ["node", "server/server.js"]