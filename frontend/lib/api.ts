import axios from "axios";

// バックエンドの URL
// Rails を使う場合も Next.js API を使う場合も、デフォルトは localhost:3001
// 変更したい場合は .env.local に NEXT_PUBLIC_API_URL=http://... を記載する
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Cookie（セッション）を送受信するために必要
  headers: {
    "Content-Type": "application/json",
  },
});
