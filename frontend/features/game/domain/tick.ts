import { calcCycles, calcGain } from "./production";
import { cleanupAndRebuildEvents } from "./event";
import useGameStore from "../store/useGameStore";

/**
 * 1 Tick の生産処理。
 * - effectiveProductionStats[id] は productionRuntimeSlice が管理する値を参照専用で使用する
 * - Tick 内では effectiveProductionStats の再計算を行わない
 * - effectiveStat が未構築の施設はスキップ（onResume / upgrade 時に必ず再構築すること）
 * - 期限切れイベントのクリーンアップを末尾で実行
 */
export const runTick = (now: number): void => {
  const {
    productionLevels,
    effectiveProductionStats,
    lastProducedAtByProduction,
    addMoney,
    setLastProducedAt,
  } = useGameStore.getState();

  for (const id of Object.keys(productionLevels)) {
    const stat = effectiveProductionStats[id];
    if (!stat) continue;

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

  // 期限切れイベントクリーンアップ & 修飾子再構築
  cleanupAndRebuildEvents(now);
};
