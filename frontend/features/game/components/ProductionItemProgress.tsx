"use client";

import { Progress } from "@/components/ui/progress";
import { getProductionProgress } from "@/features/game/domain/production";
import useGameStore from "@/features/game/store/useGameStore";

type Props = {
  id: string;
};

export function ProductionItemProgress({ id }: Props) {
  const tickAt = useGameStore((s) => s.tickAt);
  const stat = useGameStore((s) => s.effectiveProductionStats[id]);
  const lastProducedAt = useGameStore((s) => s.lastProducedAtByProduction[id] ?? tickAt);

  if (!stat) return null;

  const { progress } = getProductionProgress(stat, lastProducedAt, tickAt);

  return (
    <div className="px-3 py-2" style={{ backgroundColor: "#b5d9a8" }}>
      <Progress value={progress} />
    </div>
  );
}
