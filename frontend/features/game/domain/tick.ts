import { buildEffectiveStatFromBase, calcCycles, calcGain } from "./production";
import useGameStore from "../store/useGameStore";

/**
 * 1 Tick の生産処理。
 * - effectiveProductionStats[id] を参照し、なければ base から算出（フォールバック）
 * - Tick 内では effectiveProductionStats の再計算を行わない
 * - 期限切れイベントのクリーンアップを末尾で実行
 */
export const runTick = (now: number): void => {
  const {
    productionLevels,
    effectiveProductionStats,
    baseProductionStats,
    runtimeModifiers,
    lastProducedAtByProduction,
    addMoney,
    setLastProducedAt,
    cleanupExpiredEvents,
  } = useGameStore.getState();

  for (const id of Object.keys(productionLevels)) {
    const stat =
      effectiveProductionStats[id] ??
      buildEffectiveStatFromBase(
        baseProductionStats[id].baseYield,
        baseProductionStats[id].baseCycleMs,
        runtimeModifiers,
        id
      );

    const lastProducedAt = lastProducedAtByProduction[id] ?? 0;
    const elapsed = now - lastProducedAt;
    const cycles = calcCycles(elapsed, stat.cycleMs);

    if (cycles > 0) {
      const gain = calcGain(cycles, stat.yield);
      addMoney(gain);
      // lastProducedAt を cycles 分だけ進める（余剰時間を次 Tick へ持ち越す）
      setLastProducedAt(id, lastProducedAt + cycles * stat.cycleMs);
    }
  }

  // 期限切れイベントクリーンアップ
  cleanupExpiredEvents(now);
};
