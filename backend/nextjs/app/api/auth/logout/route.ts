import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// DELETE /api/auth/logout
// ログアウト（Cookie を削除）
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("user_name");

  return NextResponse.json({ ok: true });
}
