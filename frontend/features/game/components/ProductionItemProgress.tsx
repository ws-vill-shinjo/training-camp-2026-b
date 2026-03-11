"use client";

import { Progress } from "@/components/ui/progress";
import { getProductionProgress } from "@/features/game/domain/production";
import useGameStore from "@/features/game/store/useGameStore";
import { useEffect, useRef } from "react";

type Props = {
  id: string;
  onComplete?: () => void;
};

export function ProductionItemProgress({ id, onComplete }: Props) {
  const tickAt = useGameStore((s) => s.tickAt);
  const stat = useGameStore((s) => s.effectiveProductionStats[id]);
  const lastProducedAt = useGameStore((s) => s.lastProducedAtByProduction[id] ?? tickAt);

  const progress = stat ? getProductionProgress(stat, lastProducedAt, tickAt).progress : 0;

  // onComplete の最新参照を ref で保持
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // lastProducedAt が増加したとき = 生産サイクル完了
  const prevLastProducedAt = useRef<number | null>(null);
  useEffect(() => {
    if (
      prevLastProducedAt.current !== null &&
      lastProducedAt > prevLastProducedAt.current
    ) {
      onCompleteRef.current?.();
    }
    prevLastProducedAt.current = lastProducedAt;
  }, [lastProducedAt]);

  if (!stat) return null;

  return (
    <div className="px-3 py-2" style={{ backgroundColor: "#b5d9a8" }}>
      <Progress value={progress} />
    </div>
  );
}
