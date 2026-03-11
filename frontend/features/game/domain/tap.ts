import type { TapMaster } from "../../../master/schema/tapSchema";
import useGameStore from "../store/useGameStore";

export const TAP_MASTER_ID = "tap";

// ---------------------------------------------------------------------------
// タップ収益計算
// ---------------------------------------------------------------------------

/** tap マスターのレベルからタップ 1 回の収益を返す */
export const calcTapYield = (config: TapMaster, level: number): number => {
  switch (config.yieldType) {
    case "growth": {
      const growth = config.yieldGrowth ?? 1;
      return (config.baseYield ?? 1) * Math.pow(growth, level - 1);
    }
    case "fixed":
      return config.baseYield ?? 1;
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
// タップアクション
// ---------------------------------------------------------------------------

/**
 * ストアにキャッシュされた tapYield を money に加算する。
 * UI のタップイベントハンドラから呼ぶ。
 */
export const tap = (): void => {
  const store = useGameStore.getState();
  store.addMoney(Number(store.tapYield));
};
