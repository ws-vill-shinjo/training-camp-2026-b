"use client";

import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import useGameStore from "@/features/game/store/useGameStore";
import { ProductionItemProgress } from "./ProductionItemProgress";
type Props = {
  id: string;
  level: number;
};

export function ProductionItem({ id, level }: Props) {
  const stat = useGameStore((s) => s.effectiveProductionStats[id]);

  const master = getMasterRegistry().production[id];
  if (!master) return null;

  const yieldValue = stat ? formatNumber(Number(stat.yield)) : "-";
  const cycleSeconds = stat ? (stat.cycleMs / 1000).toFixed(1) : "-";

  return (
    <Card className="relative overflow-hidden w-full rounded-xl border-none shadow-md p-0 gap-0">
      <div className="flex items-center gap-0 px-3 py-3">
        <Image
          src={master.imageSrc}
          alt={master.name}
          width={40}
          height={40}
          className="rounded-md object-cover flex-shrink-0"
        />
        <span className="font-semibold text-sm ms-4">{master.name}</span>
        <span className="text-xs text-muted-foreground ms-2">Lv.{level}</span>
      </div>
      <div className="flex gap-4 px-3 py-1 text-xs text-muted-foreground">
        <span>収益: {yieldValue}</span>
        <span>生産時間: {cycleSeconds}s</span>
      </div>
      <ProductionItemProgress id={id} />
    </Card>
  );
}
