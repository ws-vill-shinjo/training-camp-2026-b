"use client";

import useSWR from "swr";
import { apiClient } from "@/lib/api";

export type User = {
  name: string;
};

type MeResponse = {
  user: User | null;
};

// /api/auth/me を叩いてセッション中のユーザーを取得する
const fetcher = (url: string) =>
  apiClient.get<MeResponse>(url).then((res) => res.data);

type UseAuthReturn = {
  /** 現在ログイン中のユーザー情報。未ログインの場合は null */
  user: User | null;
  /** ログイン状態かどうか */
  isLoggedIn: boolean;
  /** 初回ロード中かどうか */
  isLoading: boolean;
  /** ログイン（name と password を送信。password は "password" 固定） */
  login: (name: string, password: string) => Promise<void>;
  /** ログアウト */
  logout: () => Promise<void>;
};

/**
 * サーバーセッションと連携したモックログイン機構を提供するフック。
 * バックエンド（Rails または Next.js API）が localhost:3001 で起動している必要があります。
 *
 * @example
 * const { user, isLoggedIn, login, logout } = useAuth();
 */
export function useAuth(): UseAuthReturn {
  const { data, mutate, isLoading } = useSWR<MeResponse>(
    "/api/auth/me",
    fetcher,
    {
      // エラー時にリトライしない（バックエンド未起動時に無限リトライしないよう）
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  const login = async (name: string, password: string) => {
    const res = await apiClient.post<MeResponse>("/api/auth/login", { name, password });
    // レスポンスのユーザー情報をそのままキャッシュに入れる（再フェッチしない）
    await mutate(res.data, false);
  };

  const logout = async () => {
    await apiClient.delete("/api/auth/logout");
    // キャッシュを即座にクリアしてから再フェッチ
    await mutate({ user: null }, false);
  };

  return {
    user: data?.user ?? null,
    isLoggedIn: !!(data?.user),
    isLoading,
    login,
    logout,
  };
}
