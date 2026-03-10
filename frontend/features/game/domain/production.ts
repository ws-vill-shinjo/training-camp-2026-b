import Decimal from "decimal.js";
import type { ProductionMaster } from "../../../master/schema/productionSchema";
import type {
  BaseStat,
  EffectiveStat,
  ProductionProgress,
  RuntimeModifiers,
} from "../types/production";

// ---------------------------------------------------------------------------
// レベル別 yield 導出
// ---------------------------------------------------------------------------

/** yield(level) を Decimal で返す */
export const calcYield = (config: ProductionMaster, level: number): Decimal => {
  switch (config.yieldType) {
    case "growth": {
      const growth = config.yieldGrowth ?? 0;
      // yield(level) = baseYield * (1 + yieldGrowth * (level - 1))
      return new Decimal(config.baseYield ?? 0).times(1 + growth * (level - 1));
    }
    case "fixed":
      return new Decimal(config.baseYield ?? 0);
    case "table": {
      const entry = config.yieldTable[level - 1];
      if (entry === undefined) {
        throw new RangeError(`yieldTable に level=${level} のエントリがありません`);
      }
      return new Decimal(entry);
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
// レベルアップコスト導出
// ---------------------------------------------------------------------------

/** cost(level) = baseCost * (costGrowth ^ (level - 1)) */
export const calcCost = (config: ProductionMaster, level: number): Decimal =>
  new Decimal(config.baseCost).times(new Decimal(config.costGrowth).pow(level - 1));

// ---------------------------------------------------------------------------
// baseProductionStat 導出（store の baseProductionStats[id] へ書く値）
// ---------------------------------------------------------------------------

export const calcBaseProductionStat = (config: ProductionMaster, level: number): BaseStat => ({
  baseYield: calcYield(config, level).toFixed(),
  baseCycleMs: calcCycleMs(config, level),
});

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
  const effectiveYield = new Decimal(baseYield)
    .times(gMod.yieldMultiplier)
    .times(local.yieldMultiplier);

  // effectiveCycleMs = baseCycleMs * global.cycleMultiplier * local.cycleMultiplier
  const effectiveCycleMs =
    baseCycleMs * parseFloat(gMod.cycleMultiplier) * parseFloat(local.cycleMultiplier);

  return { yield: effectiveYield.toFixed(), cycleMs: effectiveCycleMs };
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
export const calcGain = (cycles: number, effectiveYield: string): Decimal =>
  new Decimal(cycles).times(effectiveYield);

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
