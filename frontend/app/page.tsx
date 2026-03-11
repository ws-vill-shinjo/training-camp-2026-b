"use client";

import { useMemo } from "react";
import { Header } from "@/components/Header";
import { TapZone } from "@/features/game/components/TapZone";
import { ProductionFacilities } from "@/features/game/components/ProductionFacilities";
import useGameStore from "@/features/game/store/useGameStore";
import { useGameLoop } from "@/features/game/hooks/useGameLoop";

export default function Home() {
  useGameLoop();
  const productionLevels = useGameStore((s) => s.productionLevels);

  const unlockedIds = useMemo(() => Object.keys(productionLevels), [productionLevels]);

  return (
    <div>
      <Header>
        <h1 className="text-4xl">ホーム</h1>
      </Header>
      <div className="px-4 py-4 flex flex-col gap-4">
        <ProductionFacilities ids={unlockedIds} />
        <TapZone />
      </div>
    </div>
  );
}
