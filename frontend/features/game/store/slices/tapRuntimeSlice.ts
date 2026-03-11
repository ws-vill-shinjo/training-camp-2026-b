import { StateCreator } from "zustand";
import { getMasterRegistry } from "../../../../master/registry/getMasterRegistry";
import { calcTapYield, TAP_MASTER_ID } from "../../domain/tap";
import { GameStore, TapRuntimeSlice } from "../../types/store";

export const createTapRuntimeSlice: StateCreator<GameStore, [], [], TapRuntimeSlice> = (
  set,
  get
) => ({
  tapYield: "1",

  rebuildTapYield: () => {
    const tapMaster = getMasterRegistry().tap[TAP_MASTER_ID];
    if (!tapMaster) return;

    const level = Math.max(1, get().bonusLevels[TAP_MASTER_ID] ?? 1);
    set({ tapYield: calcTapYield(tapMaster, level).toFixed() });
  },
});
