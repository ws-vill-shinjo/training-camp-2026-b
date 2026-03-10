export type { CostType } from "../../../master/types/types";

// ---------------------------------------------------------------------------
// コスト計算に必要な最小フィールド
// ProductionMaster / BonusMaster の両方がこの型を満たす
// ---------------------------------------------------------------------------

export type CostConfig = {
  costType: "growth" | "fixed" | "table";
  baseCost: number;
  costGrowth: number;
  costTable: number[];
};
