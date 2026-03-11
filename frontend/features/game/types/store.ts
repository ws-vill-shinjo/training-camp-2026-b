import type { BaseStat, EffectiveStat, Modifier, RuntimeModifiers } from "./production";
export type { BaseStat, EffectiveStat, Modifier, RuntimeModifiers };

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
  getMoney: () => number;
  addMoney: (amount: number) => void;
  spendMoney: (cost: number) => boolean;
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
  recordEventCheck: (now: number) => void;
  addActiveEvent: (event: GameEvent) => void;
  removeExpiredEvents: (now: number) => void;
  recordSeenEvent: (eventId: string) => void;
  isEventSeen: (eventId: string) => boolean;
}

export interface MetaSlice {
  lastActiveAt: Date;
  version: number;
  tickAt: number;
}

export interface ProductionRuntimeSlice {
  baseProductionStats: Record<string, BaseStat>;
  runtimeModifiers: RuntimeModifiers;
  effectiveProductionStats: Record<string, EffectiveStat>;

  rebuildBaseProductionStats: () => void;
  updateBaseProductionStat: (id: string) => void;
  rebuildRuntimeModifiers: () => void;
  rebuildRuntimeModifiersForProduction: (id: string) => void;
  rebuildEffectiveProductionStats: () => void;
}

export interface TapSlice {
  tapLevel: number;
  upgradeTapLevel: () => void;
}

export interface TapRuntimeSlice {
  /** タップ 1 回の収益（非永続化・再開／ボーナス更新時に再計算） */
  tapYield: string;
  rebuildTapYield: () => void;
}

export type GameStore = EconomySlice &
  ProductionSlice &
  BonusSlice &
  EventSlice &
  MetaSlice &
  TapSlice &
  ProductionRuntimeSlice &
  TapRuntimeSlice;
