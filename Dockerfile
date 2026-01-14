# ベースイメージ
FROM node:20

# 作業ディレクトリ
WORKDIR /app

# まず backend をコピーして依存インストール
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# frontend コピーして依存インストール
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install && npm run build

# ソースコードコピー
COPY backend ./backend
COPY frontend ./frontend

# ポート設定
EXPOSE 5000

# 起動コマンド
CMD ["node", "backend/server.js"]
