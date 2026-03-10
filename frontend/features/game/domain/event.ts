import Decimal from "decimal.js";
import { createNanoEvents } from "nanoevents";
import type { EventMaster } from "../../../master/schema/eventSchema";
import { getMasterRegistry } from "../../../master/registry/getMasterRegistry";
import type { GameDomainEventMap, ModifierAxis } from "../types/event";
import type { RuntimeModifiers } from "../types/production";
import type { GameEvent } from "../types/store";
import useGameStore from "../store/useGameStore";

// ---------------------------------------------------------------------------
// UI 通知用エミッター
// ---------------------------------------------------------------------------

export const gameEventEmitter = createNanoEvents<GameDomainEventMap>();

// ---------------------------------------------------------------------------
// イベント修飾子構築
// ---------------------------------------------------------------------------

/**
 * 有効期限内のイベントから RuntimeModifiers を構築する。
 * effectType が yieldMultiplier / cycleMultiplier / productionBoost / productionFreeze
 * のものだけを対象にする。
 */

const resolveAxis = (effectType: EventMaster["effectType"]): ModifierAxis => {
  if (effectType === "yieldMultiplier" || effectType === "productionBoost") return "yield";
  if (effectType === "cycleMultiplier" || effectType === "productionFreeze") return "cycle";
  return null;
};

export const buildEventModifiers = (
  activeEvents: GameEvent[],
  eventMasters: Record<string, EventMaster>
): RuntimeModifiers => {
  let globalYield = new Decimal(1);
  let globalCycle = new Decimal(1);
  const perProd: Record<string, { yield: Decimal; cycle: Decimal }> = {};

  for (const ev of activeEvents) {
    const master = eventMasters[ev.id];
    if (!master) continue;

    const axis = resolveAxis(master.effectType);
    if (!axis) continue;

    const value = new Decimal(ev.value);

    if (master.targetType === "global") {
      if (axis === "yield") globalYield = globalYield.times(value);
      else globalCycle = globalCycle.times(value);
    } else if (master.targetType === "production" && master.targetId) {
      perProd[master.targetId] ??= { yield: new Decimal(1), cycle: new Decimal(1) };
      perProd[master.targetId][axis] = perProd[master.targetId][axis].times(value);
    }
  }

  const byProduction: RuntimeModifiers["byProduction"] = {};
  for (const [id, mod] of Object.entries(perProd)) {
    const y = mod.yield.toFixed();
    const c = mod.cycle.toFixed();
    if (y !== "1" || c !== "1") {
      byProduction[id] = { yieldMultiplier: y, cycleMultiplier: c };
    }
  }

  return {
    global: {
      yieldMultiplier: globalYield.toFixed(),
      cycleMultiplier: globalCycle.toFixed(),
    },
    byProduction,
  };
};

// ---------------------------------------------------------------------------
// 修飾子の合成（ボーナス × イベント）
// ---------------------------------------------------------------------------

/**
 * 2 つの RuntimeModifiers を乗算で合成する。
 * bonusModifiers と eventModifiers を組み合わせる用途を想定。
 */
export const combineModifiers = (a: RuntimeModifiers, b: RuntimeModifiers): RuntimeModifiers => {
  const globalYield = new Decimal(a.global.yieldMultiplier).times(b.global.yieldMultiplier);
  const globalCycle = new Decimal(a.global.cycleMultiplier).times(b.global.cycleMultiplier);

  // 両方の byProduction キーをマージ
  const allIds = new Set([...Object.keys(a.byProduction), ...Object.keys(b.byProduction)]);

  const byProduction: RuntimeModifiers["byProduction"] = {};
  for (const id of allIds) {
    const aLocal = a.byProduction[id] ?? { yieldMultiplier: "1", cycleMultiplier: "1" };
    const bLocal = b.byProduction[id] ?? { yieldMultiplier: "1", cycleMultiplier: "1" };
    const y = new Decimal(aLocal.yieldMultiplier).times(bLocal.yieldMultiplier).toFixed();
    const c = new Decimal(aLocal.cycleMultiplier).times(bLocal.cycleMultiplier).toFixed();
    if (y !== "1" || c !== "1") {
      byProduction[id] = { yieldMultiplier: y, cycleMultiplier: c };
    }
  }

  return {
    global: {
      yieldMultiplier: globalYield.toFixed(),
      cycleMultiplier: globalCycle.toFixed(),
    },
    byProduction,
  };
};

// ---------------------------------------------------------------------------
// イベント耐性
// ---------------------------------------------------------------------------

/**
 * ボーナスの eventResist 効果量を合計して耐性値（0 以上の数値）を返す。
 * rollAndActivateEvent でランダム判定に使用する。
 */
const calcEventResist = (): number => {
  const registry = getMasterRegistry();
  const store = useGameStore.getState();
  let resist = 0;

  for (const config of Object.values(registry.bonus)) {
    if (config.effectType !== "eventResist") continue;
    const level = store.bonusLevels[config.id] ?? 0;
    if (level <= 0) continue;
    // effectType=eventResist の value は耐性確率の増加量（0〜1 の範囲を想定）
    resist += config.baseValue + (config.valueGrowth ?? 0) * (level - 1);
  }

  return Math.min(resist, 1);
};

// ---------------------------------------------------------------------------
// 加重ランダム選択
// ---------------------------------------------------------------------------

const selectWeightedRandom = (masters: EventMaster[]): EventMaster | null => {
  if (masters.length === 0) return null;
  const totalWeight = masters.reduce((sum, m) => sum + m.spawnWeight, 0);
  let rand = Math.random() * totalWeight;
  for (const master of masters) {
    rand -= master.spawnWeight;
    if (rand <= 0) return master;
  }
  return masters[masters.length - 1];
};

// ---------------------------------------------------------------------------
// 即時効果の適用
// ---------------------------------------------------------------------------

const applyInstantEffect = (master: EventMaster): void => {
  const store = useGameStore.getState();
  const value = String(master.value);

  if (master.effectType === "moneyGain") {
    store.addMoney(value);
  } else if (master.effectType === "moneyLoss") {
    store.spendMoney(value);
  }
};

// ---------------------------------------------------------------------------
// イベント発動
// ---------------------------------------------------------------------------

/**
 * 指定マスターのイベントを発動する。
 * - durationMs がある → activeEvents に追加（duration 効果）
 * - durationMs がない → 即時効果を適用
 * - 両ケースで emitter に通知し、seenEvents を更新する
 */
export const activateEvent = (master: EventMaster, now: number): void => {
  const store = useGameStore.getState();

  if (master.durationMs !== undefined) {
    const event: GameEvent = {
      id: master.id,
      durationMs: master.durationMs,
      value: String(master.value),
      startedAt: now,
    };
    store.addActiveEvent(event);
    gameEventEmitter.emit("eventActivated", event, master);
  } else {
    applyInstantEffect(master);
    // 即時イベントは duration=0 として通知のみ行う
    const event: GameEvent = {
      id: master.id,
      durationMs: 0,
      value: String(master.value),
      startedAt: now,
    };
    store.recordSeenEvent(master.id);
    gameEventEmitter.emit("eventActivated", event, master);
  }
};

// ---------------------------------------------------------------------------
// イベント抽選
// ---------------------------------------------------------------------------

/**
 * イベントを抽選して発動する。useGameLoop の useInterval から呼ぶ。
 * - lastEventCheckAt を更新
 * - 加重ランダムで候補を 1 件選択
 * - eventResist 判定でキャンセルされる場合がある
 */
export const rollAndActivateEvent = (now: number): void => {
  const store = useGameStore.getState();
  store.recordEventCheck(now);

  const registry = getMasterRegistry();
  const candidates = Object.values(registry.event);
  if (candidates.length === 0) return;

  const selected = selectWeightedRandom(candidates);
  if (!selected) return;

  // 耐性判定: resist が高いほどイベント発動確率が下がる
  const resist = calcEventResist();
  if (Math.random() < resist) return;

  activateEvent(selected, now);
};

// ---------------------------------------------------------------------------
// 期限切れクリーンアップ & 修飾子再構築
// ---------------------------------------------------------------------------

/**
 * 期限切れイベントを除去し、duration 効果を持つイベントが含まれていた場合は
 * runtimeModifiers / effectiveProductionStats を再構築する。
 * tick.ts の末尾から呼ぶ（cleanupExpiredEvents の代替）。
 */
export const cleanupAndRebuildEvents = (now: number): void => {
  const store = useGameStore.getState();
  const { activeEvents } = store;
  const registry = getMasterRegistry();

  const expired = activeEvents.filter((e) => e.startedAt + e.durationMs <= now);
  if (expired.length === 0) return;

  for (const ev of expired) {
    gameEventEmitter.emit("eventExpired", ev);
  }

  store.removeExpiredEvents(now);

  // 期限切れのイベントに duration 修飾子が含まれている場合のみ再構築
  const hasDurationModifier = expired.some((ev) => {
    const master = registry.event[ev.id];
    if (!master) return false;
    return (
      master.effectType === "yieldMultiplier" ||
      master.effectType === "cycleMultiplier" ||
      master.effectType === "productionBoost" ||
      master.effectType === "productionFreeze"
    );
  });

  if (hasDurationModifier) {
    store.rebuildRuntimeModifiers();
    store.rebuildEffectiveProductionStats();
  }
};
