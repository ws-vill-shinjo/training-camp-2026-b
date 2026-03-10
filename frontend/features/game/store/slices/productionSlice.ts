import { StateCreator } from "zustand";
import { GameStore, ProductionSlice } from "../../types/store";

export const createProductionSlice: StateCreator<GameStore, [], [], ProductionSlice> = (
  set,
  get
) => ({
  productionLevels: {},
  lastProducedAtByProduction: {},

  upgradeProductionLevel: (id) => {
    const current = get().productionLevels[id] ?? 0;
    set((state) => ({
      productionLevels: { ...state.productionLevels, [id]: current + 1 },
    }));
  },

  setLastProducedAt: (id, ts) => {
    set((state) => ({
      lastProducedAtByProduction: { ...state.lastProducedAtByProduction, [id]: ts },
    }));
  },
});
