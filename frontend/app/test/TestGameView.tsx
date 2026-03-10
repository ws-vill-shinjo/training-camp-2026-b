"use client";

import Decimal from "decimal.js";
import { useEffect, useState } from "react";
import {
  INITIAL_PRODUCTION_IDS,
  mockCsvFetcher,
} from "../../features/game/__mocks__/mockMasterCsv";
import { upgradeProduction } from "../../features/game/domain/economy";
import { calcCost } from "../../features/game/domain/economy";
import { tap } from "../../features/game/domain/tap";
import { useGameLoop } from "../../features/game/hooks/useGameLoop";
import useGameStore from "../../features/game/store/useGameStore";
import {
  getMasterRegistry,
  initializeMasterRegistry,
} from "../../master/registry/getMasterRegistry";

// ---------------------------------------------------------------------------
// ゲームループ（条件付きフックを避けるため独立コンポーネント）
// ---------------------------------------------------------------------------

function GameLoop() {
  useGameLoop();
  return null;
}

// ---------------------------------------------------------------------------
// 施設カード
// ---------------------------------------------------------------------------

function ProductionCard({ id }: { id: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 50);
    return () => clearInterval(timer);
  }, []);

  const level = useGameStore((s) => s.productionLevels[id] ?? 0);
  const stat = useGameStore((s) => s.effectiveProductionStats[id]);
  const lastProducedAt = useGameStore((s) => s.lastProducedAtByProduction[id] ?? now);
  const money = useGameStore((s) => s.money);

  if (!stat) return null;

  const master = getMasterRegistry().production[id];
  if (!master) return null;

  const elapsed = now - lastProducedAt;
  const progress = Math.min(100, ((elapsed % stat.cycleMs) / stat.cycleMs) * 100);
  const nextCost = calcCost(master, level + 1);
  const canAfford = new Decimal(money).gte(nextCost);
  const cycleSeconds = (stat.cycleMs / 1000).toFixed(1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-lg font-semibold">{master.name}</span>
        <span className="text-sm text-gray-500">Lv.{level}</span>
      </div>

      <div className="mb-3 text-sm text-gray-600">
        収益: <span className="font-medium text-green-600">¥{stat.yield}</span> / {cycleSeconds}秒
      </div>

      {/* プログレスバー */}
      <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-green-500 transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        onClick={() => upgradeProduction(id, master)}
        disabled={!canAfford}
        className="w-full rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        アップグレード — ¥{nextCost.toFixed(0)}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// メインビュー
// ---------------------------------------------------------------------------

export default function TestGameView() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeMasterRegistry(mockCsvFetcher).then(() => {
      const now = Date.now();

      // テスト用初期状態: 全施設Lv.1・所持金1000
      const initialLevels = Object.fromEntries(INITIAL_PRODUCTION_IDS.map((id) => [id, 1]));
      const initialLastProducedAt = Object.fromEntries(
        INITIAL_PRODUCTION_IDS.map((id) => [id, now])
      );

      useGameStore.setState({
        money: "1000",
        productionLevels: initialLevels,
        lastProducedAtByProduction: initialLastProducedAt,
        lastActiveAt: new Date(now),
      });

      const store = useGameStore.getState();
      store.rebuildBaseProductionStats();
      store.rebuildRuntimeModifiers();
      store.rebuildEffectiveProductionStats();
      store.rebuildTapYield();

      setReady(true);
    });
  }, []);

  const money = useGameStore((s) => s.money);
  const tapYield = useGameStore((s) => s.tapYield);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">初期化中...</div>
    );
  }

  const formattedMoney = new Intl.NumberFormat("ja-JP").format(Math.floor(Number(money)));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <GameLoop />

      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-center text-2xl font-bold text-gray-800">テストページ</h1>

        {/* 所持金 */}
        <div className="rounded-xl bg-yellow-50 p-4 text-center shadow-sm">
          <p className="text-sm text-gray-500">所持金</p>
          <p className="text-3xl font-bold text-yellow-600">¥{formattedMoney}</p>
        </div>

        {/* タップボタン */}
        <button
          onClick={tap}
          className="w-full rounded-2xl bg-orange-400 py-6 text-xl font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-orange-500"
        >
          タップ！
          <span className="ml-2 text-base font-normal opacity-80">(+¥{tapYield})</span>
        </button>

        {/* 施設一覧 */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">生産施設</h2>
          {INITIAL_PRODUCTION_IDS.map((id) => (
            <ProductionCard key={id} id={id} />
          ))}
        </div>
      </div>
    </div>
  );
}
