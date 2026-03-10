import { StateCreator } from "zustand";
import { GameStore, MetaSlice } from "../../types/store";

export const createMetaSlice: StateCreator<GameStore, [], [], MetaSlice> = () => ({
  lastActiveAt: new Date(0),
  version: 1,
});
