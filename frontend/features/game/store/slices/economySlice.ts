import { StateCreator } from "zustand";
import { EconomySlice, GameStore } from "../../types/store";

export const createEconomySlice: StateCreator<GameStore, [], [], EconomySlice> = (set, get) => ({
  money: "0",

  getMoney: () => Number(get().money),

  addMoney: (amount: number) => {
    const next = Number(get().money) + amount;
    set({ money: String(next) });
  },

  spendMoney: (cost: number) => {
    const current = Number(get().money);
    if (current < cost) return false;
    set({ money: String(current - cost) });
    return true;
  },
});
