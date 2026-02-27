import axios from "axios";

// baseURL は指定しない（同一オリジン = localhost:3000）
// /api/* へのリクエストは next.config.ts の rewrites でバックエンドにプロキシされる
export const apiClient = axios.create({
  timeout: 5000, // 5秒でタイムアウト（バックエンド未起動時に長時間待たないよう）
  headers: {
    "Content-Type": "application/json",
  },
});
