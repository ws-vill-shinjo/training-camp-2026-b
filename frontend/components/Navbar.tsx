"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * 全ページ共通のナビゲーションバー。
 * layout.tsx に配置して使います。
 */
export function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        {/* ロゴ・タイトル */}
        <Link href="/" className="navbar-brand">
          🏕️ Training Camp 2026
        </Link>

        {/* ハンバーガーメニュー（スマホ用）*/}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-content"
          aria-controls="navbar-content"
          aria-expanded="false"
          aria-label="メニューを開く"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbar-content">
          <ul className="navbar-nav ms-auto align-items-md-center gap-2">
            {isLoggedIn && user ? (
              <>
                <li className="nav-item">
                  <Link href="/profile" className="nav-link">
                    {user.name} さん
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    ログアウト
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link href="/" className="btn btn-outline-light btn-sm">
                  ログイン
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
