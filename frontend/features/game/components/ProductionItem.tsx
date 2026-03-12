"use client";

import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import useGameStore from "@/features/game/store/useGameStore";
import { ProductionItemProgress } from "./ProductionItemProgress";
import { AnimatePresence, motion, useAnimation } from "motion/react";
import { FloatingLabel } from "./FloatingLabel";
import { useState, useCallback, memo } from "react";

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

export const ProductionItem = memo(function ProductionItem({ id, level }: Props) {
  const stat = useGameStore((s) => s.effectiveProductionStats[id]);
  const [labels, setLabels] = useState<FloatingLabelType[]>([]);

  const controls = useAnimation();

  const handleComplete = useCallback(
    (cycles: number) => {
      const amount = Math.round(Number(stat?.yield ?? 1) * cycles);
      setLabels((prev) => [...prev, { id: Date.now(), x: 150, y: 30, amount }]);
      controls.start({ scale: [1, 1.03, 1], transition: { duration: 0.25, ease: "easeOut" } });
    },
    [stat?.yield, controls]
  );

  const handleLabelComplete = useCallback((labelId: number) => {
    setLabels((prev) => prev.filter((l) => l.id !== labelId));
  }, []);

  const master = getMasterRegistry().production[id];
  if (!master) return null;

  const yieldValue = stat ? formatNumber(Number(stat.yield)) : "-";
  const cycleSeconds = stat ? (stat.cycleMs / 1000).toFixed(1) : "-";

  return (
    <motion.div animate={controls} className="flex flex-col">
      <Card className="relative overflow-hidden w-full rounded-xl border-none shadow-md p-0 gap-0">
        <div className="flex items-center gap-0 px-3 py-2">
          <Image
            src={master.imageSrc}
            alt={master.name}
            width={40}
            height={40}
            className="rounded-md object-cover flex-shrink-0"
          />
          <div className="flex items-baseline gap-1 ms-4 flex-1 min-w-0">
            <span className="font-semibold text-sm truncate">{master.name}</span>
            <span className="text-xs text-muted-foreground flex-shrink-0">Lv.{level}</span>
          </div>
          <div className="flex gap-3 ms-auto text-xs text-muted-foreground">
            <span>収益: {yieldValue}</span>
            <span>{cycleSeconds}s</span>
          </div>
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
              onComplete={handleLabelComplete}
            />
          ))}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
});
