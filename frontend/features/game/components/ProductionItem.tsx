"use client";

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
  const registryReady = useGameStore((s) => s.registryReady);
  const effectiveYield = useGameStore((s) => s.effectiveProductionStats[id]?.yield);
  const [labels, setLabels] = useState<FloatingLabelType[]>([]);

  // 早期returnより前に定義
  const handleComplete = useCallback(() => {
    const amount = Math.round(Number(effectiveYield ?? 1));
    setLabels((prev) => [...prev, { id: Date.now(), x: 150, y: 30, amount }]);
  }, [effectiveYield]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const amount = Math.round(Number(effectiveYield ?? 1));
    setLabels((prev) => [
      ...prev,
      { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top, amount },
    ]);
  }, [effectiveYield]);

  // 早期returnはHooksをすべて呼んだ後
  if (!registryReady) return null;
  const master = getMasterRegistry().production[id];
  if (!master) return null;

  return (
    <Card
      className="relative overflow-hidden w-full rounded-xl border-none shadow-md p-0 gap-0"
      onPointerDown={handlePointerDown}
    >
      <div className="flex items-center gap-0 px-3 py-3" style={{ backgroundColor: "#b5d9a8" }}>
        <Image
          src={master.imageSrc}
          alt={master.name}
          width={40}
          height={40}
          className="rounded-md object-cover flex-shrink-0"
        />
        <span className="text-white text-lg font-bold tracking-wide ms-4">{master.name}</span>
        <span className="text-white text-sm ms-2">Lv.{level}</span>
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
