import { NextRequest, NextResponse } from "next/server";

// フロントエンドのオリジン（本番では実際のドメインに変更する）
const ALLOWED_ORIGIN = "http://localhost:3007";

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowed = origin === ALLOWED_ORIGIN;

  // OPTIONS プリフライトリクエストへの応答
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: buildCorsHeaders(isAllowed ? origin : ""),
    });
  }

  const response = NextResponse.next();
  const corsHeaders = buildCorsHeaders(isAllowed ? origin : "");
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

function buildCorsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// /api/* にのみ適用する
export const config = {
  matcher: "/api/:path*",
};
