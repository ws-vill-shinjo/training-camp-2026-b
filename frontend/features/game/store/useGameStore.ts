import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createBonusSlice } from "./slices/bonusSlice";
import { createEconomySlice } from "./slices/economySlice";
import { createEventSlice } from "./slices/eventSlice";
import { createMetaSlice } from "./slices/metaSlice";
import { createProductionRuntimeSlice } from "./slices/productionRuntimeSlice";
import { createProductionSlice } from "./slices/productionSlice";
import { createTapSlice } from "./slices/tapSlice";
import { createTapRuntimeSlice } from "./slices/tapRuntimeSlice";
import type { GameStore } from "../types/store";

// 永続化対象のキー
type PersistedState = Pick<
  GameStore,
  // economySlice
  | "money"
  // productionSlice
  | "productionLevels"
  | "lastProducedAtByProduction"
  // bonusSlice
  | "bonusLevels"
  // tapSlice
  | "tapLevel"
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
      ...createTapSlice(...a),
      ...createProductionRuntimeSlice(...a),
      ...createTapRuntimeSlice(...a),
    }),
    {
      name: "game-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedState => ({
        money: state.money,
        productionLevels: state.productionLevels,
        lastProducedAtByProduction: state.lastProducedAtByProduction,
        bonusLevels: state.bonusLevels,
        tapLevel: state.tapLevel,
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
