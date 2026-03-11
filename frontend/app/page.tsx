"use client";

import { useMemo } from "react";
import { Header } from "@/components/Header";
import { Money } from "@/components/Money";
import { useGameLoop } from "@/features/game/hooks/useGameLoop";
import useGameStore from "@/features/game/store/useGameStore";
import { EventNotificationDialog } from "@/features/game/components/EventNotificationDialog";
import { ProductionFacilities } from "@/features/game/components/ProductionFacilities";
import { TapZone } from "@/features/game/components/TapZone";

const GameLoop = () => {
  useGameLoop();
  return null;
};

export default function Home() {
  const registryReady = useGameStore((s) => s.registryReady);
  const productionLevels = useGameStore((s) => s.productionLevels);

  const unlockedIds = useMemo(() => Object.keys(productionLevels), [productionLevels]);

  return (
    <div>
      {registryReady && <GameLoop />}
      <EventNotificationDialog />
      <Header>
        <h1 className="text-4xl">ホーム</h1>
      </Header>
      <div className="px-4 py-4 flex flex-col gap-4">
        <Money />
        <ProductionFacilities ids={unlockedIds} />
        <TapZone />
      </div>
    </div>
  );
}
