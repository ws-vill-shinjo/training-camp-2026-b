"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import useGameStore from "@/features/game/store/useGameStore";
import { ProductionItemProgress } from "./ProductionItemProgress";

type Props = {
  id: string;
  level: number;
};

export function ProductionItem({ id, level }: Props) {
  const registryReady = useGameStore((s) => s.registryReady);
  if (!registryReady) return null;
  const master = getMasterRegistry().production[id];
  if (!master) return null;

  return (
    <Card className="overflow-hidden w-full rounded-xl border-none shadow-md p-0 gap-0">
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
      <ProductionItemProgress id={id} />
    </Card>
  );
}
