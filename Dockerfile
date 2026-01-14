FROM node:20
WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY backend ./backend
COPY frontend ./frontend

EXPOSE 5000

CMD ["node", "backend/server.js"]
