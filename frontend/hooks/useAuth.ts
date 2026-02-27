"use client";

import { useState } from "react";

// モックユーザーの型定義
export type MockUser = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
};

// ログイン済みとして扱うモックユーザー一覧
// ハッカソン用にサンプルデータを用意しています
const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: "山田 太郎",
    email: "yamada@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "鈴木 花子",
    email: "suzuki@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "佐藤 次郎",
    email: "sato@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  },
];

// デフォルトでログインするユーザー（最初の1人目）
const DEFAULT_USER = MOCK_USERS[0];

type UseAuthReturn = {
  /** 現在ログイン中のユーザー情報。未ログインの場合は null */
  user: MockUser | null;
  /** ログイン状態かどうか */
  isLoggedIn: boolean;
  /** モックログインを実行する。user を省略すると DEFAULT_USER でログイン */
  login: (user?: MockUser) => void;
  /** ログアウトする */
  logout: () => void;
  /** 選択可能なモックユーザー一覧 */
  mockUsers: MockUser[];
};

/**
 * モックログイン機構を提供するフック。
 * 実際の認証バックエンドは不要で、import してすぐに使えます。
 *
 * @example
 * const { user, isLoggedIn, login, logout } = useAuth();
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<MockUser | null>(null);

  const login = (targetUser: MockUser = DEFAULT_USER) => {
    setUser(targetUser);
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    isLoggedIn: user !== null,
    login,
    logout,
    mockUsers: MOCK_USERS,
  };
}
