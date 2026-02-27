#!/bin/bash
set -e

echo "🏕️ Training Camp 2026 - 環境セットアップ開始..."

# --- frontend のセットアップ（常に実行）---
if [ -d "frontend" ]; then
  echo "📦 frontend のパッケージをインストール中..."
  yarn --cwd frontend install
fi

# --- backend/rails のセットアップ（Rails を選んだチーム用）---
if [ -d "backend/rails" ]; then
  echo "💎 backend/rails の Gem をインストール中..."
  bundle install --gemfile backend/rails/Gemfile
fi

# --- backend/nextjs のセットアップ（Next.js API を選んだチーム用）---
if [ -d "backend/nextjs" ]; then
  echo "📦 backend/nextjs のパッケージをインストール中..."
  yarn --cwd backend/nextjs install
fi

echo ""
echo "============================================"
echo "  🎉 セットアップ完了！"
echo "============================================"
echo ""
echo "  🚀 開発を始めるには:"
echo "    フロントエンド  → cd frontend && yarn dev"
echo ""
echo "  バックエンドはいずれか一方を選んで起動:"
echo "    Rails バックエンド   → cd backend/rails && bin/rails server -p 3001"
echo "    Next.js バックエンド → cd backend/nextjs && yarn dev --port 3001"
echo ""
echo "  🤖 Claude Code を使うには:"
echo "    ターミナルで claude と入力"
echo ""
echo "============================================"
