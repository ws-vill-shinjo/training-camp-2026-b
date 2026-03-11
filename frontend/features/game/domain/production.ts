import type { ProductionMaster } from "../../../master/schema/productionSchema";
import { getMasterRegistry } from "../../../master/registry/getMasterRegistry";
import type {
  BaseStat,
  EffectiveStat,
  ProductionProgress,
  RuntimeModifiers,
} from "../types/production";

// ---------------------------------------------------------------------------
// レベル別 yield 導出
// ---------------------------------------------------------------------------

/** yield(level) を number で返す */
export const calcYield = (config: ProductionMaster, level: number): number => {
  switch (config.yieldType) {
    case "growth": {
      const growth = config.yieldGrowth ?? 0;
      // yield(level) = baseYield * (1 + yieldGrowth * (level - 1))
      return (config.baseYield ?? 0) * (1 + growth * (level - 1));
    }
    case "fixed":
      return config.baseYield ?? 0;
    case "table": {
      const entry = config.yieldTable[level - 1];
      if (entry === undefined) {
        throw new RangeError(`yieldTable に level=${level} のエントリがありません`);
      }
      return entry;
    }
  }
};

// ---------------------------------------------------------------------------
// レベル別 cycleMs 導出
// ---------------------------------------------------------------------------

/** cycle(level) = baseCycleMs * (cycleReduceRate ^ (level - 1)) */
export const calcCycleMs = (config: ProductionMaster, level: number): number =>
  config.baseCycleMs * Math.pow(config.cycleReduceRate, level - 1);

// ---------------------------------------------------------------------------
// baseProductionStat 導出（store の baseProductionStats[id] へ書く値）
// ---------------------------------------------------------------------------

export const calcBaseProductionStat = (config: ProductionMaster, level: number): BaseStat => ({
  baseYield: String(calcYield(config, level)),
  baseCycleMs: calcCycleMs(config, level),
});

/** マスターレジストリから id の config を取得して BaseStat を算出する */
export const buildBaseStatForId = (id: string, level: number): BaseStat | null => {
  const config = getMasterRegistry().production[id];
  if (!config) return null;
  return calcBaseProductionStat(config, level);
};

/** 解放済み施設すべての BaseStat を一括構築する */
export const buildAllBaseStats = (
  productionLevels: Record<string, number>
): Record<string, BaseStat> => {
  const stats: Record<string, BaseStat> = {};
  for (const [id, level] of Object.entries(productionLevels)) {
    const stat = buildBaseStatForId(id, level);
    if (stat) stats[id] = stat;
  }
  return stats;
};

// ---------------------------------------------------------------------------
// effectiveStat 導出
// ---------------------------------------------------------------------------

const BASE_MULTIPLIER = "1";

/** baseYield / baseCycleMs と修飾子から effectiveStat を算出する（Tick 内フォールバック用） */
export const buildEffectiveStatFromBase = (
  baseYield: string,
  baseCycleMs: number,
  modifiers: RuntimeModifiers,
  id: string
): EffectiveStat => {
  const { global: gMod, byProduction } = modifiers;
  const local = byProduction[id] ?? {
    yieldMultiplier: BASE_MULTIPLIER,
    cycleMultiplier: BASE_MULTIPLIER,
  };

  // effectiveYield = baseYield * global.yieldMultiplier * local.yieldMultiplier
  const effectiveYield =
    Number(baseYield) * Number(gMod.yieldMultiplier) * Number(local.yieldMultiplier);

  // effectiveCycleMs = baseCycleMs / (global.cycleMultiplier * local.cycleMultiplier)
  // cycleMultiplier は速度倍率なので割ることでサイクル時間を短縮する（1.1 = 10%速く）
  const effectiveCycleMs =
    baseCycleMs / (Number(gMod.cycleMultiplier) * Number(local.cycleMultiplier));

  return { yield: String(effectiveYield), cycleMs: effectiveCycleMs };
};

/**
 * rebuildEffectiveProductionStats 用の純粋計算。
 * - effectiveProductionStats を全施設分構築する
 * - localModifier が両方 1 かつグローバル補正も 1 の場合は byProduction エントリを除去した
 *   cleanedModifiers を返す
 */
export const buildEffectiveStats = (
  baseProductionStats: Record<string, BaseStat>,
  modifiers: RuntimeModifiers
): {
  effectiveProductionStats: Record<string, EffectiveStat>;
  cleanedModifiers: RuntimeModifiers;
} => {
  const effectiveProductionStats: Record<string, EffectiveStat> = {};
  const nextByProduction: RuntimeModifiers["byProduction"] = {};

  const gMod = modifiers.global;
  const globalIsOne =
    parseFloat(gMod.yieldMultiplier) === 1 && parseFloat(gMod.cycleMultiplier) === 1;

  for (const [id, base] of Object.entries(baseProductionStats)) {
    const local = modifiers.byProduction[id] ?? {
      yieldMultiplier: BASE_MULTIPLIER,
      cycleMultiplier: BASE_MULTIPLIER,
    };
    const localIsOne =
      parseFloat(local.yieldMultiplier) === 1 && parseFloat(local.cycleMultiplier) === 1;

    // 乗数が全て 1 のときはエントリを保持しない
    if (!(globalIsOne && localIsOne)) {
      nextByProduction[id] = local;
    }

    effectiveProductionStats[id] = buildEffectiveStatFromBase(
      base.baseYield,
      base.baseCycleMs,
      modifiers,
      id
    );
  }

  return {
    effectiveProductionStats,
    cleanedModifiers: { global: gMod, byProduction: nextByProduction },
  };
};

// ---------------------------------------------------------------------------
// Tick 計算
// ---------------------------------------------------------------------------

/** 経過時間から生産回数を算出（cycles = floor(elapsed / effectiveCycleMs)） */
export const calcCycles = (elapsedMs: number, effectiveCycleMs: number): number =>
  Math.floor(elapsedMs / effectiveCycleMs);

/** cycles * effectiveYield で収益を算出する */
export const calcGain = (cycles: number, effectiveYield: string): number =>
  cycles * Number(effectiveYield);

/** 現サイクル内の進捗率（0〜100）を返す */
export const calcProgress = (elapsedMs: number, effectiveCycleMs: number): number =>
  Math.min(100, ((elapsedMs % effectiveCycleMs) / effectiveCycleMs) * 100);

// ---------------------------------------------------------------------------
// 施設単位の進捗取得
// ---------------------------------------------------------------------------

export const getProductionProgress = (
  stat: EffectiveStat,
  lastProducedAt: number,
  now: number
): ProductionProgress => {
  const elapsed = now - lastProducedAt;
  const { cycleMs } = stat;
  return {
    progress: calcProgress(elapsed, cycleMs),
    elapsedInCycle: elapsed % cycleMs,
    cycleMs,
  };
};
