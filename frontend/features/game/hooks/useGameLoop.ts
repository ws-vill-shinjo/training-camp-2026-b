"use client";

import { differenceInMilliseconds } from "date-fns";
import { useEffect, useRef } from "react";
import { useInterval, useRafLoop } from "react-use";
import { buildEffectiveStatFromBase, calcCycles, calcGain } from "../domain/production";
import useGameStore from "../store/useGameStore";

/** ドメイン Tick の最小間隔 (ms) */
const TICK_MS = 500;

/** イベント抽選の実行間隔 (ms) */
const EVENT_CHECK_INTERVAL_MS = 30000;

const runResume = (store: ReturnType<typeof useGameStore.getState>): void => {
  // 1. effectiveProductionStats を最新化
  store.rebuildBaseProductionStats();
  store.rebuildRuntimeModifiers();
  store.rebuildEffectiveProductionStats();

  const now = Date.now();

  // 2. 離脱中に蓄積した生産分の追いつき計算
  const {
    effectiveProductionStats,
    baseProductionStats,
    runtimeModifiers,
    lastProducedAtByProduction,
    addMoney,
    setLastProducedAt,
  } = useGameStore.getState();

  for (const id of Object.keys(baseProductionStats)) {
    const stat =
      effectiveProductionStats[id] ??
      buildEffectiveStatFromBase(
        baseProductionStats[id].baseYield,
        baseProductionStats[id].baseCycleMs,
        runtimeModifiers,
        id
      );

    const lastProducedAt = lastProducedAtByProduction[id] ?? 0;
    const elapsed = now - lastProducedAt;
    const cycles = calcCycles(elapsed, stat.cycleMs);

    if (cycles > 0) {
      const gain = calcGain(cycles, stat.yield);
      addMoney(gain);
      setLastProducedAt(id, lastProducedAt + cycles * stat.cycleMs);
    }
  }

  useGameStore.setState({ lastActiveAt: new Date(now) });
};

const runTick = (): void => {
  const now = Date.now();
  const state = useGameStore.getState();

  const {
    effectiveProductionStats,
    baseProductionStats,
    runtimeModifiers,
    lastProducedAtByProduction,
    addMoney,
    setLastProducedAt,
    cleanupExpiredEvents,
  } = state;

  // effectiveProductionStats[id] 参照で生産回数・収益計算
  for (const id of Object.keys(baseProductionStats)) {
    const stat =
      effectiveProductionStats[id] ??
      buildEffectiveStatFromBase(
        baseProductionStats[id].baseYield,
        baseProductionStats[id].baseCycleMs,
        runtimeModifiers,
        id
      );

    const lastProducedAt = lastProducedAtByProduction[id] ?? 0;
    const elapsed = now - lastProducedAt;
    const cycles = calcCycles(elapsed, stat.cycleMs);

    if (cycles > 0) {
      const gain = calcGain(cycles, stat.yield);
      addMoney(gain);
      // lastProducedAt を cycles 分だけ進める（余剰時間を次 Tick へ持ち越す）
      setLastProducedAt(id, lastProducedAt + cycles * stat.cycleMs);
    }
  }

  // 期限切れイベントクリーンアップ
  cleanupExpiredEvents(now);
};

export const useGameLoop = (): void => {
  const lastTickAtRef = useRef<number>(0);
  const resumedRef = useRef<boolean>(false);

  // --- 初回マウント時の復帰処理 ---
  useEffect(() => {
    if (!resumedRef.current) {
      resumedRef.current = true;
      const state = useGameStore.getState();
      const lastActiveAt = state.lastActiveAt;
      const now = Date.now();
      const awayMs = differenceInMilliseconds(now, lastActiveAt);

      // 離脱時間がある場合は追いつき計算つきリビルドを実行
      if (awayMs > 0) {
        runResume(state);
      } else {
        state.rebuildBaseProductionStats();
        state.rebuildRuntimeModifiers();
        state.rebuildEffectiveProductionStats();
      }

      lastTickAtRef.current = now;
    }
  }, []);

  // --- requestAnimationFrame ループ（TICK_MS ごとにドメイン Tick を実行）---
  useRafLoop(() => {
    const now = Date.now();
    if (now - lastTickAtRef.current >= TICK_MS) {
      lastTickAtRef.current = now;
      runTick();
    }
  });

  // --- イベント抽選（EVENT_CHECK_INTERVAL_MS ごと）---
  useInterval(() => {
    const now = Date.now();
    useGameStore.getState().rollEvent(now);
  }, EVENT_CHECK_INTERVAL_MS);
};
