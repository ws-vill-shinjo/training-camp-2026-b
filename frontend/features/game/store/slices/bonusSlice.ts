import { StateCreator } from "zustand";
import { BonusSlice, GameStore } from "../../types/store";

export const createBonusSlice: StateCreator<GameStore, [], [], BonusSlice> = (set, get) => ({
  bonusLevels: {},

  upgradeBonusLevel: (id) => {
    const current = get().bonusLevels[id] ?? 0;
    set((state) => ({
      bonusLevels: { ...state.bonusLevels, [id]: current + 1 },
    }));
  },
});
