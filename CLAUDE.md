# Training Camp 2026 - ハッカソン用テンプレート

## プロジェクト概要

開発合宿（ハッカソン）で参加チームが利用するテンプレートリポジトリ。
参加者が環境構築に時間を取られず、開発テーマにすぐ着手できることが最優先。

## 技術スタック

- **フロントエンド**: Next.js (App Router)
- **バックエンド**: Next.js API Routes または Ruby on Rails（チームが選択）
- **Node.js**: 22
- **Ruby**: 3.4
- **データベース**: 各チームが選択・実装

## ディレクトリ構成

```
/
├── .devcontainer/
│   ├── devcontainer.json    # コンテナ定義
│   └── setup.sh             # 起動後の自動セットアップ
├── CLAUDE.md                # このファイル（Claude Code 用）
├── package.json
└── ...
```

## devcontainer に関するルール

- `.devcontainer/devcontainer.json` と `.devcontainer/setup.sh` がコンテナ定義の中心
- ベースイメージは `mcr.microsoft.com/devcontainers/ruby:1-3.4-bookworm`
- ツールの追加は可能な限り devcontainer features を使う（Dockerfile を別途作らない）
- setup.sh は冪等であること（何度実行しても同じ結果になる）
- ポートフォワードの追加が必要な場合は `forwardPorts` に追記する
- 新しい VS Code 拡張が必要な場合は `customizations.vscode.extensions` に追記する

## 提供するモック機能

参加者が import して呼ぶだけで動く状態にする。

### 1. モックログイン機構
- `useAuth()` フックでログイン状態をシミュレート
- ログイン / ログアウトの切り替え
- ユーザー情報（名前、アバター等）の取得
- 実際の認証バックエンドは不要

### 2. SNS 共有機能
- シェアボタン UI コンポーネント（X, LINE, リンクコピー）
- クリックで共有ダイアログまたは URL を開く挙動のサンプル

## コーディング規約

- TypeScript を使用（strict mode）
- スタイリングは Bootstrap5
- コンポーネントは関数コンポーネント + Hooks
- 日本語コメントを推奨（参加者が読みやすいように）

## 注意事項

- 参加者の環境は WSL + devcontainer を想定
- コンテナのリビルドが最小限で済むよう、変更の影響範囲に注意する
- setup.sh に処理を追加する場合は、実行時間が長くならないよう配慮する
