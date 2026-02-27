import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /api/* へのリクエストをバックエンドにプロキシする
  // これによりブラウザからは同一オリジン通信になり、Cookie が安定して動く
  // バックエンドを変えたい場合は .env.local に API_URL=http://... を設定する
  async rewrites() {
    const apiUrl = process.env.API_URL ?? "http://localhost:3008";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
