import type { BonusMaster } from "../../../master/schema/bonusSchema";
import type { RuntimeModifiers } from "../types/production";
import { calcCost, canAfford } from "./economy";
import useGameStore from "../store/useGameStore";
import { Accum, ModifierAxis } from "../types/bonus";

// ---------------------------------------------------------------------------
// effect 導出
// ---------------------------------------------------------------------------

/**
 * valueType ごとにレベルの効果量を算出する。
 *
 * growth: effect(level) = baseValue + valueGrowth * (level - 1)
 * fixed:  effect(level) = baseValue
 * table:  effect(level) = valueTable[level - 1]
 */
export const calcEffect = (config: BonusMaster, level: number): number => {
  switch (config.valueType) {
    case "growth":
      return config.baseValue + config.valueGrowth * (level - 1);
    case "fixed":
      return config.baseValue;
    case "table": {
      const entry = config.valueTable[level - 1];
      if (entry === undefined) {
        throw new RangeError(`valueTable に level=${level} のエントリがありません`);
      }
      return entry;
    }
  }
};

// ---------------------------------------------------------------------------
// RuntimeModifiers 構築
// ---------------------------------------------------------------------------

const initAccum = (): Accum => ({ yield: 1, cycle: 1 });

const resolveAxis = (effectType: BonusMaster["effectType"]): ModifierAxis => {
  if (effectType === "yieldMultiplier") return "yield";
  if (effectType === "cycleMultiplier") return "cycle";
  return null;
};

const applyBonusEffect = (
  config: BonusMaster,
  level: number,
  globalAccum: Accum,
  perProd: Record<string, Accum>,
  allProductionIds: string[]
): void => {
  const axis = resolveAxis(config.effectType);
  if (!axis) return;

  const effect = calcEffect(config, level);

  if (config.targetType === "global") {
    globalAccum[axis] *= effect;
    return;
  }

  if (config.targetType === "production" && config.targetId) {
    (perProd[config.targetId] ??= initAccum())[axis] *= effect;
  }

  if (config.targetType === "allProduction") {
    for (const id of allProductionIds) {
      (perProd[id] ??= initAccum())[axis] *= effect;
    }
  }
};

/**
 * 全ボーナスのレベルから RuntimeModifiers を構築する。
 * - 適用順を id 昇順に固定して再現性を確保
 * - level=0 のエントリは未取得として無視
 * - 乗数が 1 のエントリは byProduction に保持しない
 */
export const buildRuntimeModifiers = (
  bonusMasters: BonusMaster[],
  bonusLevels: Record<string, number>,
  allProductionIds: string[]
): RuntimeModifiers => {
  // 適用順固定
  const sorted = [...bonusMasters].sort((a, b) => a.id.localeCompare(b.id));

  const globalAccum = initAccum();
  const perProd: Record<string, Accum> = {};

  for (const config of sorted) {
    const level = bonusLevels[config.id] ?? 0;
    if (level <= 0) continue;
    applyBonusEffect(config, level, globalAccum, perProd, allProductionIds);
  }

  // 乗数が両方 1 のエントリは保持しない
  const byProduction: RuntimeModifiers["byProduction"] = {};
  for (const [id, mod] of Object.entries(perProd)) {
    const y = String(mod.yield);
    const c = String(mod.cycle);
    if (y !== "1" || c !== "1") {
      byProduction[id] = { yieldMultiplier: y, cycleMultiplier: c };
    }
  }

  return {
    global: {
      yieldMultiplier: String(globalAccum.yield),
      cycleMultiplier: String(globalAccum.cycle),
    },
    byProduction,
  };
};

// ---------------------------------------------------------------------------
// ボーナスアップグレード
// ---------------------------------------------------------------------------

/**
 * 指定ボーナスを 1 レベルアップする。
 * - 所持金不足の場合は何もせず false を返す
 * - 成功時はコスト消費 → レベル更新 → runtimeModifiers / effectiveStat 再構築まで行う
 */
export const upgradeBonus = (id: string, config: BonusMaster): boolean => {
  const store = useGameStore.getState();
  const currentLevel = store.bonusLevels[id] ?? 0;
  const cost = calcCost(config, currentLevel + 1);

  if (!canAfford(store.money, cost)) return false;

  store.spendMoney(cost);
  store.upgradeBonusLevel(id);
  store.rebuildRuntimeModifiers();
  store.rebuildEffectiveProductionStats();
  store.rebuildTapYield();
  // 初回アンロック時は lastProducedAt が未設定の production を現在時刻で初期化し、tick での大量計算を防ぐ
  if (currentLevel === 0) {
    const now = Date.now();
    for (const prodId of Object.keys(store.productionLevels)) {
      if ((store.lastProducedAtByProduction[prodId] ?? 0) === 0) {
        store.setLastProducedAt(prodId, now);
      }
    }
  }
  return true;
};
