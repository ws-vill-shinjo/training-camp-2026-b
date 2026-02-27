"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();

  // 未ログインならトップページへリダイレクト
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/");
    }
  }, [isLoading, isLoggedIn, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (isLoading) {
    return (
      <main className="container py-5">
        <p className="text-muted">読み込み中...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="container py-5" style={{ maxWidth: 600 }}>
      <div className="card">
        <div className="card-body text-center py-5">
          <h1 className="display-6 mb-4">あなたの名前は</h1>
          <p className="display-4 fw-bold text-primary mb-4">{user.name}</p>
          <p className="text-muted mb-4">です</p>
          <div className="d-flex justify-content-center gap-2">
            <a href="/" className="btn btn-outline-secondary">
              トップへ戻る
            </a>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
