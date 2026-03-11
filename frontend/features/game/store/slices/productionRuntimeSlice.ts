import { StateCreator } from "zustand";
import { getMasterRegistry } from "../../../../master/registry/getMasterRegistry";
import { buildRuntimeModifiers } from "../../domain/bonus";
import { buildEventModifiers, combineModifiers } from "../../domain/event";
import {
  buildAllBaseStats,
  buildBaseStatForId,
  buildEffectiveStats,
} from "../../domain/production";
import { GameStore, ProductionRuntimeSlice } from "../../types/store";

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

  rebuildBaseProductionStats: () => {
    const { productionLevels } = get();
    set({ baseProductionStats: buildAllBaseStats(productionLevels) });
  },

  /** 単一施設の baseStat をマスターレジストリから更新する */
  updateBaseProductionStat: (id) => {
    const level = get().productionLevels[id] ?? 1;
    const stat = buildBaseStatForId(id, level);
    if (!stat) return;
    set((state) => ({
      baseProductionStats: {
        ...state.baseProductionStats,
        [id]: stat,
      },
    }));
  },

  /** ボーナスとイベントの修飾子を合成してランタイム修飾子を全件再構築する */
  rebuildRuntimeModifiers: () => {
    const { bonusLevels, activeEvents } = get();
    const registry = getMasterRegistry();
    const bonusMods = buildRuntimeModifiers(Object.values(registry.bonus), bonusLevels);
    const eventMods = buildEventModifiers(activeEvents, registry.event);
    set({ runtimeModifiers: combineModifiers(bonusMods, eventMods) });
  },

  /**
   * 単一施設のランタイム修飾子を更新する。
   * グローバル修飾子が全施設に影響するため全件再構築と同等の処理を行う。
   */
  rebuildRuntimeModifiersForProduction: () => {
    const { bonusLevels, activeEvents } = get();
    const registry = getMasterRegistry();
    const bonusMods = buildRuntimeModifiers(Object.values(registry.bonus), bonusLevels);
    const eventMods = buildEventModifiers(activeEvents, registry.event);
    set({ runtimeModifiers: combineModifiers(bonusMods, eventMods) });
  },

  /**
   * effectiveProductionStats を全施設分再計算する。
   * Tick では呼び出さず、トリガー時のみ実行する。
   * onResume: rebuildBaseProductionStats → rebuildRuntimeModifiers → rebuildEffectiveProductionStats
   */
  rebuildEffectiveProductionStats: () => {
    const { baseProductionStats, runtimeModifiers } = get();
    const { effectiveProductionStats } = buildEffectiveStats(baseProductionStats, runtimeModifiers);
    set({ effectiveProductionStats });
  },
});
