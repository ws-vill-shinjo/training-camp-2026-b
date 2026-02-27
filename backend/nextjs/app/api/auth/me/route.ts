import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// GET /api/auth/me
// セッション中のユーザー情報を返す
export async function GET() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value;

  return NextResponse.json({
    user: userName ? { name: userName } : null,
  });
}
