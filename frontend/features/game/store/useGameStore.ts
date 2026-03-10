import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createBonusSlice } from "./slices/bonusSlice";
import { createEconomySlice } from "./slices/economySlice";
import { createEventSlice } from "./slices/eventSlice";
import { createMetaSlice } from "./slices/metaSlice";
import { createProductionRuntimeSlice } from "./slices/productionRuntimeSlice";
import { createProductionSlice } from "./slices/productionSlice";
import type { GameStore } from "../types/store";

// 永続化対象のキー
type PersistedState = Pick<
  GameStore,
  // economySlice
  | "money"
  | "tapLevel"
  // productionSlice
  | "productionLevels"
  | "lastProducedAtByProduction"
  // bonusSlice
  | "bonusLevels"
  // eventSlice
  | "lastEventCheckAt"
  | "activeEvents"
  | "seenEvents"
  // metaSlice
  | "lastActiveAt"
  | "version"
>;

const useGameStore = create<GameStore>()(
  persist(
    (...a) => ({
      ...createEconomySlice(...a),
      ...createProductionSlice(...a),
      ...createBonusSlice(...a),
      ...createEventSlice(...a),
      ...createMetaSlice(...a),
      ...createProductionRuntimeSlice(...a),
    }),
    {
      name: "game-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedState => ({
        money: state.money,
        tapLevel: state.tapLevel,
        productionLevels: state.productionLevels,
        lastProducedAtByProduction: state.lastProducedAtByProduction,
        bonusLevels: state.bonusLevels,
        lastEventCheckAt: state.lastEventCheckAt,
        activeEvents: state.activeEvents,
        seenEvents: state.seenEvents,
        lastActiveAt: state.lastActiveAt,
        version: state.version,
      }),
      // JSON.parse で文字列になった Date フィールドを復元する
      onRehydrateStorage: () => (state) => {
        if (state && !(state.lastActiveAt instanceof Date)) {
          state.lastActiveAt = new Date(state.lastActiveAt);
        }
      },
    }
  )
);

export default useGameStore;
