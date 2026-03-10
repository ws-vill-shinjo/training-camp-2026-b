import { StateCreator } from "zustand";
import { getMasterRegistry } from "../../../../master/registry/getMasterRegistry";
import { calcTapYield } from "../../domain/tap";
import { GameStore, TapRuntimeSlice } from "../../types/store";

const TAP_BONUS_ID = "tap";

export const createTapRuntimeSlice: StateCreator<GameStore, [], [], TapRuntimeSlice> = (
  set,
  get
) => ({
  tapYield: "1",

  rebuildTapYield: () => {
    const { bonusLevels } = get();
    const tapBonus = getMasterRegistry().bonus[TAP_BONUS_ID];
    set({ tapYield: calcTapYield(tapBonus, bonusLevels).toFixed() });
  },
});
