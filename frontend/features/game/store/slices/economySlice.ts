import Decimal from "decimal.js";
import { StateCreator } from "zustand";
import { DecimalValue, EconomySlice, GameStore } from "../../types/store";

export const createEconomySlice: StateCreator<GameStore, [], [], EconomySlice> = (set, get) => ({
  money: "0",

  addMoney: (amount: DecimalValue) => {
    const next = new Decimal(get().money).plus(amount);
    set({ money: next.toFixed() });
  },

  spendMoney: (cost: DecimalValue) => {
    const current = new Decimal(get().money);
    const spend = new Decimal(cost);
    if (current.lessThan(spend)) return false;
    set({ money: current.minus(spend).toFixed() });
    return true;
  },
});
