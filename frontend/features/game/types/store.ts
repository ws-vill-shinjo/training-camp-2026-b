import Decimal from "decimal.js";
export type { Decimal };

/** decimal.js が受け付ける入力型 (string | number | bigint | Decimal) */
export type DecimalValue = Decimal.Value;

export type GameEvent = {
  id: string;
  durationMs: number;
  value: string; // TODO 型を用意する
  startedAt: number;
};

// ---------------------------------------------------------------------------
// Slice interfaces
// ---------------------------------------------------------------------------

export interface EconomySlice {
  money: string;
  tapLevel: number;
  addMoney: (amount: DecimalValue) => void;
  spendMoney: (cost: DecimalValue) => boolean;
}

export interface ProductionSlice {
  productionLevels: Record<string, number>;
  lastProducedAtByProduction: Record<string, number>;
  upgradeProductionLevel: (id: string) => void;
  setLastProducedAt: (id: string, ts: number) => void;
}

export interface BonusSlice {
  bonusLevels: Record<string, number>;
  upgradeBonusLevel: (id: string) => void;
}

export interface EventSlice {
  lastEventCheckAt: number;
  activeEvents: GameEvent[];
  seenEvents: Record<string, true>;
  rollEvent: (now: number) => void;
  activateEvent: (event: GameEvent) => void;
  cleanupExpiredEvents: (now: number) => void;
  markEventSeen: (eventId: string) => void;
  hasSeenEvent: (eventId: string) => boolean;
}

export interface MetaSlice {
  lastActiveAt: Date;
  version: number;
}

export interface ProductionRuntimeSlice {
  baseProductionStats: Record<string, { baseYield: string; baseCycleMs: number }>;
  runtimeModifiers: {
    global: { yieldMultiplier: string; cycleMultiplier: string };
    byProduction: Record<string, { yieldMultiplier: string; cycleMultiplier: string }>;
  };
  effectiveProductionStats: Record<string, { yield: string; cycleMs: number }>;

  rebuildBaseProductionStats: () => void;
  updateBaseProductionStat: (id: string) => void;
  rebuildRuntimeModifiers: () => void;
  rebuildRuntimeModifiersForProduction: (id: string) => void;
  rebuildEffectiveProductionStats: () => void;
}

export type GameStore = EconomySlice &
  ProductionSlice &
  BonusSlice &
  EventSlice &
  MetaSlice &
  ProductionRuntimeSlice;
