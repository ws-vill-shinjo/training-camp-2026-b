import { createNanoEvents } from "nanoevents";

export type QrEventMap = {
  "qr:unlockSuccess": (payload: { contentId: string }) => void;
  "qr:unlockFailed": (payload: { reason: string }) => void;
};

export const gameEvents = createNanoEvents<QrEventMap>();
