type GameEventMap = {
  "qr:unlockSuccess": { contentId: string };
  "qr:unlockFailed": { reason: string };
};

type Listener<T> = (payload: T) => void;

class GameEventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: { [K in keyof GameEventMap]?: Listener<any>[] } = {};

  on<K extends keyof GameEventMap>(event: K, listener: Listener<GameEventMap[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof GameEventMap>(event: K, listener: Listener<GameEventMap[K]>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter((l) => l !== listener);
  }

  emit<K extends keyof GameEventMap>(event: K, payload: GameEventMap[K]): void {
    if (!this.listeners[event]) return;
    for (const listener of this.listeners[event]!) {
      listener(payload);
    }
  }
}

export const gameEvents = new GameEventEmitter();
