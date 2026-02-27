"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ShareButtons } from "@/components/ShareButtons";

export default function Home() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(name, password);
      router.push("/profile");
    } catch {
      setError("ログインに失敗しました。名前とパスワードを確認してください。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setName("");
    setPassword("");
  };

  return (
    <main className="container py-5" style={{ maxWidth: 600 }}>
      <h1 className="mb-4">Training Camp 2026 🏕️</h1>

      {/* ---- ログイン / ログイン済み表示 ---- */}
      <section className="card mb-4">
        <div className="card-header">
          <h2 className="h5 mb-0">ログイン</h2>
        </div>
        <div className="card-body">
          {isLoggedIn && user ? (
            /* ログイン済み */
            <div>
              <p className="mb-3">
                <span className="fw-bold">{user.name}</span> さん、こんにちは！
              </p>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                ログアウト
              </button>
            </div>
          ) : (
            /* ログインフォーム */
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  名前
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  placeholder="山田 太郎"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="form-text">パスワードは「password」と入力してください</div>
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "ログイン中..." : "ログイン"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ---- SNS シェアボタン ---- */}
      <section className="card">
        <div className="card-header">
          <h2 className="h5 mb-0">シェア</h2>
        </div>
        <div className="card-body">
          <ShareButtons url="https://example.com" text="Training Camp 2026 に参加中！" />
        </div>
      </section>
    </main>
  );
}
