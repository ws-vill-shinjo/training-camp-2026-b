import { StateCreator } from "zustand";
import { EventSlice, GameEvent, GameStore } from "../../types/store";

export const createEventSlice: StateCreator<GameStore, [], [], EventSlice> = (set, get) => ({
  lastEventCheckAt: 0,
  activeEvents: [],
  seenEvents: {},

  rollEvent: (now) => {
    // lastEventCheckAt を更新。イベント抽選ロジックはゲーム設計に応じて実装する
    set({ lastEventCheckAt: now });
  },

  activateEvent: (event: GameEvent) => {
    set((state) => ({
      activeEvents: [...state.activeEvents, event],
    }));
    // 成功時に必ず markEventSeen を実行（冪等）
    get().markEventSeen(event.id);
  },

  cleanupExpiredEvents: (now) => {
    set((state) => ({
      activeEvents: state.activeEvents.filter((e) => e.startedAt + e.durationMs > now),
    }));
  },

  markEventSeen: (eventId) => {
    set((state) => ({
      seenEvents: { ...state.seenEvents, [eventId]: true },
    }));
  },

  hasSeenEvent: (eventId) => {
    return get().seenEvents[eventId] === true;
  },
});
