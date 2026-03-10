import Decimal from "decimal.js";
import useGameStore from "../store/useGameStore";

/** オフライン進行の上限時間 (ms) = 8時間 */
export const OFFLINE_MAX_MS = 8 * 60 * 60 * 1000;

/**
 * 復帰時の追いつき一括計算。
 *
 * - elapsedMs = min(now - lastActiveAt, OFFLINE_MAX_MS) で全施設を一括計算
 * - effectiveProductionStats は呼び出し前の rebuild 済み値を参照専用で使用する
 * - オフライン中はイベント変動を扱わない（安全モード）
 * - effectiveStat が未構築の施設はスキップ
 *
 * 呼び出し前に必ず実行:
 *   rebuildBaseProductionStats() → rebuildRuntimeModifiers() → rebuildEffectiveProductionStats()
 */
export const runOfflineCatchup = (now: number): void => {
  const { lastActiveAt, productionLevels, effectiveProductionStats, addMoney, setLastProducedAt } =
    useGameStore.getState();

  const elapsedMs = Math.min(now - lastActiveAt.getTime(), OFFLINE_MAX_MS);
  if (elapsedMs <= 0) return;

  for (const id of Object.keys(productionLevels)) {
    const stat = effectiveProductionStats[id];
    if (!stat) continue;

    const cycles = Math.floor(elapsedMs / stat.cycleMs);
    if (cycles <= 0) continue;

    const gain = new Decimal(cycles).times(stat.yield);
    const remainderMs = elapsedMs % stat.cycleMs;

    addMoney(gain);
    // lastProducedAt = now - remainderMs（端数時間を次 Tick へ持ち越す）
    setLastProducedAt(id, now - remainderMs);
  }

  useGameStore.setState({ lastActiveAt: new Date(now) });
};
