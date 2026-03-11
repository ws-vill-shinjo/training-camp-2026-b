import { StateCreator } from "zustand";
import { GameStore, TapSlice } from "../../types/store";

export const createTapSlice: StateCreator<GameStore, [], [], TapSlice> = (set, get) => ({
  tapLevel: 1,

  upgradeTapLevel: () => {
    set({ tapLevel: get().tapLevel + 1 });
  },
});
