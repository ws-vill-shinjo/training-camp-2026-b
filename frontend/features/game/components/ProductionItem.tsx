"use client";

import numbro from "numbro";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import useGameStore from "@/features/game/store/useGameStore";
import { ProductionItemProgress } from "./ProductionItemProgress";
import { AnimatePresence } from "motion/react";
import { FloatingLabel } from "./FloatingLabel";
import { useState, useCallback } from "react";

type Props = {
  id: string;
  level: number;
};

type FloatingLabelType = {
  id: number;
  x: number;
  y: number;
  amount: number;
};

export function ProductionItem({ id, level }: Props) {
  const effectiveYield = useGameStore((s) => s.effectiveProductionStats[id]?.yield);
  const [labels, setLabels] = useState<FloatingLabelType[]>([]);
  const stat = useGameStore((s) => s.effectiveProductionStats[id]);

  const handleComplete = useCallback(() => {
    const amount = Math.round(Number(effectiveYield ?? 1));
    setLabels((prev) => [...prev, { id: Date.now(), x: 150, y: 30, amount }]);
  }, [effectiveYield]);

  const master = getMasterRegistry().production[id];
  if (!master) return null;

  const yieldValue = stat ? numbro(Number(stat.yield)).format({ average: true }) : "-";
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
      <ProductionItemProgress id={id} onComplete={handleComplete} />

      <AnimatePresence>
        {labels.map((label) => (
          <FloatingLabel
            key={label.id}
            id={label.id}
            x={label.x}
            y={label.y}
            amount={label.amount}
            onComplete={(id) => setLabels((prev) => prev.filter((l) => l.id !== id))}
          />
        ))}
      </AnimatePresence>
    </Card>
  );
}
