import type { CostConfig } from "../types/economy";
import useGameStore from "../store/useGameStore";

// ---------------------------------------------------------------------------
// コスト導出
// ---------------------------------------------------------------------------

/**
 * costType ごとにレベルアップコストを算出する。
 *
 * growth: cost(level) = baseCost * (costGrowth ^ (level - 1))
 * fixed:  cost(level) = baseCost
 * table:  cost(level) = costTable[level - 1]
 */
export const calcCost = (config: CostConfig, level: number): number => {
  switch (config.costType) {
    case "growth":
      return config.baseCost * Math.pow(config.costGrowth, level - 1);
    case "fixed":
      return config.baseCost;
    case "table": {
      const entry = config.costTable[level - 1];
      if (entry === undefined) {
        throw new RangeError(`costTable に level=${level} のエントリがありません`);
      }
      return entry;
    }
  }
};

// ---------------------------------------------------------------------------
// 購入可否判定
// ---------------------------------------------------------------------------

/** 現在の所持金でコストを払えるか判定する */
export const canAfford = (money: string, cost: number): boolean => Number(money) >= cost;

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
  // 初回アンロック時は lastProducedAt を現在時刻で初期化し、tick での大量計算を防ぐ
  if (currentLevel === 0) store.setLastProducedAt(id, Date.now());
  return true;
};
