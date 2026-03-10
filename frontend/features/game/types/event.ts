import type { EventMaster } from "../../../master/schema/eventSchema";
import type { GameEvent } from "./store";

// ---------------------------------------------------------------------------
// UI 通知用エミッターのイベントマップ
// ---------------------------------------------------------------------------

export type GameDomainEventMap = {
  eventActivated: (event: GameEvent, master: EventMaster) => void;
  eventExpired: (event: GameEvent) => void;
};

// ---------------------------------------------------------------------------
// イベント修飾子計算の内部型
// ---------------------------------------------------------------------------

/** yieldMultiplier / cycleMultiplier のどちらの軸に適用するかを表す */
export type ModifierAxis = "yield" | "cycle" | null;
