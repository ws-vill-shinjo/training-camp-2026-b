import Decimal from "decimal.js";
import { buildEffectiveStatFromBase } from "./production";
import useGameStore from "../store/useGameStore";

/** オフライン進行の上限時間 (ms) = 8時間 */
export const OFFLINE_MAX_MS = 8 * 60 * 60 * 1000;

/**
 * 復帰時の追いつき一括計算。
 *
 * - elapsedMs = min(now - lastActiveAt, OFFLINE_MAX_MS) で全施設を一括計算
 * - オフライン中はイベント変動を扱わない（安全モード）
 * - ボーナスは離脱時点のスナップショット固定
 *   （呼び出し前に rebuildBaseProductionStats / rebuildRuntimeModifiers /
 *    rebuildEffectiveProductionStats を先行実行すること）
 */
export const runOfflineCatchup = (now: number): void => {
  const {
    lastActiveAt,
    productionLevels,
    effectiveProductionStats,
    baseProductionStats,
    runtimeModifiers,
    addMoney,
    setLastProducedAt,
  } = useGameStore.getState();

  const elapsedMs = Math.min(now - lastActiveAt.getTime(), OFFLINE_MAX_MS);
  if (elapsedMs <= 0) return;

  for (const id of Object.keys(productionLevels)) {
    const stat =
      effectiveProductionStats[id] ??
      buildEffectiveStatFromBase(
        baseProductionStats[id].baseYield,
        baseProductionStats[id].baseCycleMs,
        runtimeModifiers,
        id
      );

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
