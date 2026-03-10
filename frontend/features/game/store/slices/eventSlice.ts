import { StateCreator } from "zustand";
import { EventSlice, GameEvent, GameStore } from "../../types/store";

export const createEventSlice: StateCreator<GameStore, [], [], EventSlice> = (set, get) => ({
  lastEventCheckAt: 0,
  activeEvents: [],
  seenEvents: {},

  recordEventCheck: (now) => {
    set({ lastEventCheckAt: now });
  },

  addActiveEvent: (event: GameEvent) => {
    set((state) => ({
      activeEvents: [...state.activeEvents, event],
    }));
    get().recordSeenEvent(event.id);
  },

  removeExpiredEvents: (now) => {
    set((state) => ({
      activeEvents: state.activeEvents.filter((e) => e.startedAt + e.durationMs > now),
    }));
  },

  recordSeenEvent: (eventId) => {
    set((state) => ({
      seenEvents: { ...state.seenEvents, [eventId]: true },
    }));
  },

  isEventSeen: (eventId) => {
    return get().seenEvents[eventId] === true;
  },
});
