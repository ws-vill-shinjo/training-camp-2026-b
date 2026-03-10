import Decimal from "decimal.js";
import { StateCreator } from "zustand";
import { GameStore, ProductionRuntimeSlice } from "../../types/store";

const multiply = (a: string, b: string): string => new Decimal(a).times(b).toFixed();

export const createProductionRuntimeSlice: StateCreator<
  GameStore,
  [],
  [],
  ProductionRuntimeSlice
> = (set, get) => ({
  baseProductionStats: {},
  runtimeModifiers: {
    global: { yieldMultiplier: "1", cycleMultiplier: "1" },
    byProduction: {},
  },
  effectiveProductionStats: {},

  /**
   * 全プロダクションの基本スタットを再構築する。
   * TODO: PRODUCTION_CONFIG などのゲーム設定テーブルから baseYield / baseCycleMs を計算する。
   */
  rebuildBaseProductionStats: () => {
    const { productionLevels } = get();
    const newStats: ProductionRuntimeSlice["baseProductionStats"] = {};
    for (const id of Object.keys(productionLevels)) {
      // TODO: ゲーム設定テーブルを参照して level に応じた値を計算する
      newStats[id] = { baseYield: "1", baseCycleMs: 1000 };
    }
    set({ baseProductionStats: newStats });
  },

  /**
   * 単一プロダクションの基本スタットを更新する。
   * TODO: PRODUCTION_CONFIG を参照して実装する。
   */
  updateBaseProductionStat: (id) => {
    // TODO: ゲーム設定テーブルを参照して level に応じた値を計算する
    set((state) => ({
      baseProductionStats: {
        ...state.baseProductionStats,
        [id]: { baseYield: "1", baseCycleMs: 1000 },
      },
    }));
  },

  /**
   * 全プロダクションのランタイム修飾子を再構築する。
   * activeEvents / bonusLevels を参照してグローバル・個別の乗数を集計する。
   * TODO: イベント/ボーナス種別ごとの効果定義テーブルを参照する。
   */
  rebuildRuntimeModifiers: () => {
    const { productionLevels } = get();
    const globalYieldMul = 1;
    const globalCycleMul = 1;
    // TODO: activeEvents / bonusLevels から乗数を集計する

    const byProduction: ProductionRuntimeSlice["runtimeModifiers"]["byProduction"] = {};
    for (const id of Object.keys(productionLevels)) {
      // TODO: 個別修飾子を集計し、乗数が 1 のときはエントリを省略する
      const yieldMul = 1;
      const cycleMul = 1;
      if (yieldMul !== 1 || cycleMul !== 1) {
        byProduction[id] = {
          yieldMultiplier: String(yieldMul),
          cycleMultiplier: String(cycleMul),
        };
      }
    }

    set({
      runtimeModifiers: {
        global: {
          yieldMultiplier: String(globalYieldMul),
          cycleMultiplier: String(globalCycleMul),
        },
        byProduction,
      },
    });
  },

  /**
   * 単一プロダクションのランタイム修飾子を更新する。
   * TODO: イベント/ボーナス種別ごとの効果定義テーブルを参照する。
   */
  rebuildRuntimeModifiersForProduction: (id) => {
    // TODO: 当該 id への個別修飾子を集計する
    const yieldMul = 1;
    const cycleMul = 1;

    set((state) => {
      const next = { ...state.runtimeModifiers.byProduction };
      if (yieldMul === 1 && cycleMul === 1) {
        // 乗数が 1 のときはエントリを保持しない
        delete next[id];
      } else {
        next[id] = {
          yieldMultiplier: String(yieldMul),
          cycleMultiplier: String(cycleMul),
        };
      }
      return {
        runtimeModifiers: { ...state.runtimeModifiers, byProduction: next },
      };
    });
  },

  /**
   * effectiveProductionStats を全プロダクション分再計算する。
   * Tick では呼び出さず、トリガー時のみ実行する。
   * onResume シーケンス: rebuildBaseProductionStats -> rebuildRuntimeModifiers -> rebuildEffectiveProductionStats
   */
  rebuildEffectiveProductionStats: () => {
    const { baseProductionStats, runtimeModifiers } = get();
    const { global: gMod, byProduction: byProd } = runtimeModifiers;

    const next: ProductionRuntimeSlice["effectiveProductionStats"] = {};
    for (const [id, base] of Object.entries(baseProductionStats)) {
      const perMod = byProd[id];
      const yieldMul = perMod
        ? multiply(gMod.yieldMultiplier, perMod.yieldMultiplier)
        : gMod.yieldMultiplier;
      const cycleMul = perMod
        ? multiply(gMod.cycleMultiplier, perMod.cycleMultiplier)
        : gMod.cycleMultiplier;

      next[id] = {
        yield: multiply(base.baseYield, yieldMul),
        cycleMs: base.baseCycleMs * parseFloat(cycleMul),
      };
    }

    set({ effectiveProductionStats: next });
  },
});
