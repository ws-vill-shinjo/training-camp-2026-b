// master スキーマ由来の enum 型を再エクスポート
export type { YieldType } from "../../../master/types/types";

// ---------------------------------------------------------------------------
// ストア保存用の基本スタット
// ---------------------------------------------------------------------------

/** store の baseProductionStats[id] に保持する値 */
export type BaseStat = {
  baseYield: string;
  baseCycleMs: number;
};

// ---------------------------------------------------------------------------
// ランタイム修飾子
// ---------------------------------------------------------------------------

/** yield / cycle への乗数ペア */
export type Modifier = {
  yieldMultiplier: string;
  cycleMultiplier: string;
};

/** store の runtimeModifiers に保持する構造 */
export type RuntimeModifiers = {
  global: Modifier;
  /** id をキーとした施設別乗数。乗数が両方 1 のときはエントリを保持しない */
  byProduction: Record<string, Modifier>;
};

// ---------------------------------------------------------------------------
// 有効スタット（effectiveProductionStats[id]）
// ---------------------------------------------------------------------------

/** base × modifier を適用した実効値 */
export type EffectiveStat = {
  yield: string;
  cycleMs: number;
};

// ---------------------------------------------------------------------------
// 施設単位の進捗情報
// ---------------------------------------------------------------------------

export type ProductionProgress = {
  /** 現サイクル内の進捗率 0〜100 */
  progress: number;
  /** 今サイクルの経過 ms */
  elapsedInCycle: number;
  /** サイクル ms */
  cycleMs: number;
};

export type ProductionFacilityItem = {
  id: string;
  name: string;
  imageSrc: string;
  progress: number;
};
