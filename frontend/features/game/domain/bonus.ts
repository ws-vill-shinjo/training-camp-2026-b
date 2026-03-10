import Decimal from "decimal.js";
import type { BonusMaster } from "../../../master/schema/bonusSchema";
import type { RuntimeModifiers } from "../types/production";
import { calcCost, canAfford } from "./economy";
import useGameStore from "../store/useGameStore";

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
export const calcEffect = (config: BonusMaster, level: number): Decimal => {
  switch (config.valueType) {
    case "growth":
      return new Decimal(config.baseValue).plus(config.valueGrowth * (level - 1));
    case "fixed":
      return new Decimal(config.baseValue);
    case "table": {
      const entry = config.valueTable[level - 1];
      if (entry === undefined) {
        throw new RangeError(`valueTable に level=${level} のエントリがありません`);
      }
      return new Decimal(entry);
    }
  }
};

// ---------------------------------------------------------------------------
// RuntimeModifiers 構築
// ---------------------------------------------------------------------------

/**
 * 全ボーナスのレベルから RuntimeModifiers を構築する。
 * - 適用順を id 昇順に固定して再現性を確保
 * - level=0 のエントリは未取得として無視
 * - 乗数が 1 のエントリは byProduction に保持しない
 */
export const buildRuntimeModifiers = (
  bonusMasters: BonusMaster[],
  bonusLevels: Record<string, number>
): RuntimeModifiers => {
  // 適用順固定
  const sorted = [...bonusMasters].sort((a, b) => a.id.localeCompare(b.id));

  let globalYield = new Decimal(1);
  let globalCycle = new Decimal(1);

  // 施設別の中間集計（Decimal のまま保持）
  const perProd: Record<string, { yield: Decimal; cycle: Decimal }> = {};

  for (const config of sorted) {
    const level = bonusLevels[config.id] ?? 0;
    if (level <= 0) continue;

    const effect = calcEffect(config, level);

    if (config.effectType === "yieldMultiplier") {
      if (config.targetType === "global") {
        globalYield = globalYield.times(effect);
      } else if (config.targetType === "production" && config.targetId) {
        perProd[config.targetId] ??= { yield: new Decimal(1), cycle: new Decimal(1) };
        perProd[config.targetId].yield = perProd[config.targetId].yield.times(effect);
      }
    } else if (config.effectType === "cycleMultiplier") {
      if (config.targetType === "global") {
        globalCycle = globalCycle.times(effect);
      } else if (config.targetType === "production" && config.targetId) {
        perProd[config.targetId] ??= { yield: new Decimal(1), cycle: new Decimal(1) };
        perProd[config.targetId].cycle = perProd[config.targetId].cycle.times(effect);
      }
    }
  }

  // 乗数が両方 1 のエントリは保持しない
  const byProduction: RuntimeModifiers["byProduction"] = {};
  for (const [id, mod] of Object.entries(perProd)) {
    const y = mod.yield.toFixed();
    const c = mod.cycle.toFixed();
    if (y !== "1" || c !== "1") {
      byProduction[id] = { yieldMultiplier: y, cycleMultiplier: c };
    }
  }

  return {
    global: {
      yieldMultiplier: globalYield.toFixed(),
      cycleMultiplier: globalCycle.toFixed(),
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
  return true;
};
