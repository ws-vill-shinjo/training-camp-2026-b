import Decimal from "decimal.js";
import type { CostConfig } from "../types/economy";
import useGameStore from "../store/useGameStore";

// ---------------------------------------------------------------------------
// コスト導出
// ---------------------------------------------------------------------------

/**
 * costType ごとにレベルアップコストを算出する。
 * 返却値は常に Decimal で統一し、UI 層には DecimalString または format 済み文字列のみ渡すこと。
 *
 * growth: cost(level) = baseCost * (costGrowth ^ (level - 1))
 * fixed:  cost(level) = baseCost
 * table:  cost(level) = costTable[level - 1]
 */
export const calcCost = (config: CostConfig, level: number): Decimal => {
  switch (config.costType) {
    case "growth":
      return new Decimal(config.baseCost).times(new Decimal(config.costGrowth).pow(level - 1));
    case "fixed":
      return new Decimal(config.baseCost);
    case "table": {
      const entry = config.costTable[level - 1];
      if (entry === undefined) {
        throw new RangeError(`costTable に level=${level} のエントリがありません`);
      }
      return new Decimal(entry);
    }
  }
};

// ---------------------------------------------------------------------------
// 購入可否判定
// ---------------------------------------------------------------------------

/** 現在の所持金でコストを払えるか判定する */
export const canAfford = (money: string, cost: Decimal): boolean => new Decimal(money).gte(cost);

// ---------------------------------------------------------------------------
// プロダクションアップグレード
// ---------------------------------------------------------------------------

/**
 * 指定施設を 1 レベルアップする。
 * - 所持金不足の場合は何もせず false を返す
 * - 成功時はコスト消費 → レベル更新 → baseStat / effectiveStat 再構築まで行う
 */
export const upgradeProduction = (id: string, config: CostConfig): boolean => {
  const store = useGameStore.getState();
  const currentLevel = store.productionLevels[id] ?? 0;
  const cost = calcCost(config, currentLevel + 1);

  if (!canAfford(store.money, cost)) return false;

  store.spendMoney(cost);
  store.upgradeProductionLevel(id);
  store.updateBaseProductionStat(id);
  store.rebuildEffectiveProductionStats();
  return true;
};
