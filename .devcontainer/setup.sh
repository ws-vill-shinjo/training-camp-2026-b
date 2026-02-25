#!/bin/bash
set -e

echo "🏕️ Training Camp 2026 - 環境セットアップ開始..."

# --- Next.js プロジェクトのセットアップ ---
if [ -f "package.json" ]; then
  echo "📦 npm パッケージをインストール中..."
  npm install
fi

# --- Rails プロジェクトのセットアップ (Gemfile がある場合) ---
if [ -f "Gemfile" ]; then
  echo "💎 Gem をインストール中..."
  bundle install
fi

echo ""
echo "============================================"
echo "  🎉 セットアップ完了！"
echo "============================================"
echo ""
echo "  🚀 開発を始めるには:"
echo "    Next.js  → npm run dev"
echo "    Rails    → bin/rails server -p 3001"
echo ""
echo "  🤖 Claude Code を使うには:"
echo "    ターミナルで claude と入力"
echo ""
echo "============================================"
