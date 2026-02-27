#!/bin/bash
set -e

echo "🏕️ Training Camp 2026 - 環境セットアップ開始..."

# --- frontend のセットアップ（常に実行）---
if [ -d "frontend" ]; then
  echo "📦 frontend の npm パッケージをインストール中..."
  npm install --prefix frontend
fi

# --- backend/rails のセットアップ（Rails を選んだチーム用）---
if [ -d "backend/rails" ]; then
  echo "💎 backend/rails の Gem をインストール中..."
  bundle install --gemfile backend/rails/Gemfile
fi

# --- backend/nextjs のセットアップ（Next.js API を選んだチーム用）---
if [ -d "backend/nextjs" ]; then
  echo "📦 backend/nextjs の npm パッケージをインストール中..."
  npm install --prefix backend/nextjs
fi

echo ""
echo "============================================"
echo "  🎉 セットアップ完了！"
echo "============================================"
echo ""
echo "  🚀 開発を始めるには:"
echo "    フロントエンド  → cd frontend && npm run dev"
echo ""
echo "  バックエンドはいずれか一方を選んで起動:"
echo "    Rails バックエンド   → cd backend/rails && bin/rails server -p 3001"
echo "    Next.js バックエンド → cd backend/nextjs && npm run dev -- -p 3001"
echo ""
echo "  🤖 Claude Code を使うには:"
echo "    ターミナルで claude と入力"
echo ""
echo "============================================"
