import Decimal from "decimal.js";
import type { TapMaster } from "../../../master/schema/tapSchema";
import useGameStore from "../store/useGameStore";

export const TAP_MASTER_ID = "tap";

// ---------------------------------------------------------------------------
// タップ収益計算
// ---------------------------------------------------------------------------

/** tap マスターのレベルからタップ 1 回の収益を返す */
export const calcTapYield = (config: TapMaster, level: number): Decimal => {
  switch (config.yieldType) {
    case "growth": {
      const growth = config.yieldGrowth ?? 0;
      return new Decimal(config.baseYield ?? 0).times(growth * Math.max(0, level - 1));
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
