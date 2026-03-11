"use client";

import { differenceInMilliseconds } from "date-fns";
import { useEffect, useRef } from "react";
import { useInterval, useRafLoop } from "react-use";
import { rollAndActivateEvent } from "../domain/event";
import { runOfflineCatchup } from "../domain/offline";
import { runTick } from "../domain/tick";
import useGameStore from "../store/useGameStore";

/** ドメイン Tick の最小間隔 (ms) */
const TICK_MS = 500;

/** イベント抽選の実行間隔 (ms) */
const EVENT_CHECK_INTERVAL_MS = 30000;

const runResume = (): void => {
  const store = useGameStore.getState();
  store.rebuildBaseProductionStats();
  store.rebuildRuntimeModifiers();
  store.rebuildEffectiveProductionStats();
  store.rebuildTapYield();
  runOfflineCatchup(Date.now());
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
        runResume();
      } else {
        state.rebuildBaseProductionStats();
        state.rebuildRuntimeModifiers();
        state.rebuildEffectiveProductionStats();
        state.rebuildTapYield();
      }

      lastTickAtRef.current = now;
    }
  }, []);

  // --- requestAnimationFrame ループ（TICK_MS ごとにドメイン Tick を実行）---
  useRafLoop(() => {
    const now = Date.now();
    if (now - lastTickAtRef.current >= TICK_MS) {
      lastTickAtRef.current = now;
      useGameStore.setState({ tickAt: now });
      runTick(now);
    }
  });

  // --- イベント抽選（EVENT_CHECK_INTERVAL_MS ごと）---
  useInterval(() => {
    const now = Date.now();
    rollAndActivateEvent(now);
  }, EVENT_CHECK_INTERVAL_MS);
};
