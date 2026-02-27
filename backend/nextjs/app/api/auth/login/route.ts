import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/login
// ログイン（パスワードは "password" 固定）
export async function POST(request: NextRequest) {
  const { name, password } = await request.json();
  const trimmedName = name?.toString().trim() ?? "";

  if (!trimmedName) {
    return NextResponse.json({ error: "名前を入力してください" }, { status: 422 });
  }

  if (password !== "password") {
    return NextResponse.json({ error: "パスワードが違います" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("user_name", trimmedName, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1日
  });

  return NextResponse.json({ user: { name: trimmedName } });
}
