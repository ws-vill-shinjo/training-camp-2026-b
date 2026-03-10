import Decimal from "decimal.js";
import type { BonusMaster } from "../../../master/schema/bonusSchema";
import { calcEffect } from "./bonus";
import useGameStore from "../store/useGameStore";

/** タップボーナスのマスター ID */
const TAP_BONUS_ID = "tap";

/** タップ 1 回あたりの基礎収益 */
const BASE_TAP_YIELD = new Decimal(1);

// ---------------------------------------------------------------------------
// タップ収益計算
// ---------------------------------------------------------------------------

/**
 * tap ボーナスのレベルからタップ 1 回の収益を返す。
 * level=0（未取得）の場合は基礎収益をそのまま返す。
 */
export const calcTapYield = (
  tapBonus: BonusMaster | undefined,
  bonusLevels: Record<string, number>
): Decimal => {
  const level = tapBonus ? (bonusLevels[TAP_BONUS_ID] ?? 0) : 0;
  if (level <= 0) return BASE_TAP_YIELD;
  return BASE_TAP_YIELD.times(calcEffect(tapBonus!, level));
};

// ---------------------------------------------------------------------------
// タップアクション
// ---------------------------------------------------------------------------

/**
 * ストアにキャッシュされた tapYield を money に加算する。
 * UI のタップイベントハンドラから呼ぶ。
 */
export const tap = (): void => {
  const store = useGameStore.getState();
  store.addMoney(store.tapYield);
};
