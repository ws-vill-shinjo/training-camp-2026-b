# Training Camp 2026 - ハッカソンテンプレート

開発合宿（ハッカソン）用のスターターテンプレートです。
環境構築なしですぐに開発を始められます。

## 必要な環境

- Windows (WSL2) または macOS
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Visual Studio Code](https://code.visualstudio.com/)
- VS Code 拡張: [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## クイックスタート

```bash
# 1. このリポジトリをクローン
git clone <このリポジトリの URL>
cd training-camp-2026

# 2. VS Code で開く
code .

# 3. 右下に表示される「Reopen in Container」をクリック
#    （表示されない場合: Ctrl+Shift+P → "Dev Containers: Reopen in Container"）
```

コンテナが起動すると自動でパッケージのインストールが完了します。

## ディレクトリ構成

```
/
├── frontend/          # Next.js フロントエンド（全チーム共通）
├── backend/
│   ├── rails/         # Rails API バックエンド（Rails チーム用）
│   └── nextjs/        # Next.js API バックエンド（Next.js チーム用）
└── .devcontainer/     # 開発環境の設定
```

## 開発サーバーの起動

ターミナルを2つ開いて、フロントエンドとバックエンドをそれぞれ起動します。

### フロントエンド（全チーム共通）

```bash
cd frontend
yarn dev
# → http://localhost:3000
```

### バックエンド（どちらか一方を選ぶ）

**Rails を使う場合**

```bash
cd backend/rails
bin/rails db:create db:migrate   # 初回のみ
bin/rails server
# → http://localhost:3001
```

**Next.js API を使う場合**

```bash
cd backend/nextjs
yarn dev
# → http://localhost:3001
```

## 技術スタック

| レイヤー               | 技術                                                   |
| ---------------------- | ------------------------------------------------------ |
| フロントエンド         | Next.js 16 (App Router) / TypeScript / Bootstrap 5     |
| バックエンド (選択式)  | Ruby on Rails 8.1 API モード または Next.js API Routes |
| パッケージマネージャー | yarn (Node.js) / Bundler (Ruby)                        |
| 言語バージョン         | Node.js 22 / Ruby 3.4                                  |
| DB                     | 各チームが自由に選択（デフォルト: SQLite）             |

## チームでの作業開始手順

1. このテンプレートから自分たちのリポジトリを作成する
2. バックエンドを **Rails** か **Next.js API** のどちらか決める
3. 使わない方の `backend/` ディレクトリを削除する
4. `frontend/` でアプリ開発を始める

> **バックエンドの切り替え方法**
> フロントエンドの `/api/*` へのリクエストは `frontend/next.config.ts` の rewrites 設定で
> バックエンド（デフォルト `http://localhost:3001`）にプロキシされます。
> 接続先を変えたい場合は `frontend/.env.local` に `API_URL=http://...` を設定してください。

## 提供モック機能

すぐに使えるモック機能が組み込まれています。動作確認は http://localhost:3000 から行えます。

### モックログイン（`useAuth`）

バックエンドのセッションと連携したログイン機構です。
パスワードは `password` 固定で、名前は自由に入力できます。

```tsx
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();

  if (isLoading) return <p>読み込み中...</p>;

  return isLoggedIn ? (
    <div>
      <p>{user.name} さん、こんにちは！</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  ) : (
    <button onClick={() => login("山田太郎", "password")}>ログイン</button>
  );
}
```

#### バックエンド API

| メソッド | パス               | 説明                                   |
| -------- | ------------------ | -------------------------------------- |
| `POST`   | `/api/auth/login`  | ログイン（body: `{ name, password }`） |
| `GET`    | `/api/auth/me`     | ログイン中のユーザー取得               |
| `DELETE` | `/api/auth/logout` | ログアウト                             |

### SNS シェアボタン（`ShareButtons`）

X（旧 Twitter）・LINE・リンクコピーの3種類を提供します。

```tsx
import { ShareButtons } from "@/components/ShareButtons";

export default function Page() {
  return <ShareButtons url="https://example.com" text="シェアしよう！" />;
}
```

## Claude Code の使い方

このテンプレートには Claude Code が組み込まれています。

```bash
# ターミナルで起動
claude
```

コードの生成、バグ修正、機能追加など、開発全般をサポートします。

## ポートの割り当て

| ポート | 用途                                    |
| ------ | --------------------------------------- |
| 3000   | フロントエンド (Next.js)                |
| 3001   | バックエンド (Rails または Next.js API) |
| 5432   | PostgreSQL（使う場合）                  |
