import Decimal from "decimal.js";

export type Accum = { yield: Decimal; cycle: Decimal };
export type ModifierAxis = "yield" | "cycle" | null;
