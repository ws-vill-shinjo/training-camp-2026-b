"use client";

import { useAuth } from "@/hooks/useAuth";
import { ShareButtons } from "@/components/ShareButtons";

export default function Home() {
  const { user, isLoggedIn, login, logout, mockUsers } = useAuth();

  return (
    <main className="container py-5">
      <h1 className="mb-4">Training Camp 2026 🏕️</h1>

      {/* ---- useAuth のデモ ---- */}
      <section className="card mb-4">
        <div className="card-header">
          <h2 className="h5 mb-0">useAuth() のデモ</h2>
        </div>
        <div className="card-body">
          {isLoggedIn && user ? (
            <div className="d-flex align-items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl}
                alt={user.name}
                width={48}
                height={48}
                className="rounded-circle"
              />
              <div>
                <div className="fw-bold">{user.name}</div>
                <div className="text-muted small">{user.email}</div>
              </div>
              <button className="btn btn-outline-danger btn-sm ms-auto" onClick={logout}>
                ログアウト
              </button>
            </div>
          ) : (
            <div>
              <p className="text-muted">ログインしていません</p>
              {/* モックユーザーを選んでログイン */}
              <div className="d-flex gap-2 flex-wrap">
                {mockUsers.map((u) => (
                  <button key={u.id} className="btn btn-primary btn-sm" onClick={() => login(u)}>
                    {u.name} としてログイン
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---- ShareButtons のデモ ---- */}
      <section className="card mb-4">
        <div className="card-header">
          <h2 className="h5 mb-0">ShareButtons のデモ</h2>
        </div>
        <div className="card-body">
          <ShareButtons url="https://example.com" text="Training Camp 2026 に参加中！" />
        </div>
      </section>

      {/* ---- 使い方 ---- */}
      <section className="card">
        <div className="card-header">
          <h2 className="h5 mb-0">使い方</h2>
        </div>
        <div className="card-body">
          <h3 className="h6">useAuth()</h3>
          <pre className="bg-light p-3 rounded small">{`import { useAuth } from "@/hooks/useAuth";

const { user, isLoggedIn, login, logout } = useAuth();`}</pre>

          <h3 className="h6 mt-3">ShareButtons</h3>
          <pre className="bg-light p-3 rounded small">{`import { ShareButtons } from "@/components/ShareButtons";

<ShareButtons url="https://example.com" text="シェアしよう！" />`}</pre>
        </div>
      </section>
    </main>
  );
}
