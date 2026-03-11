"use client";

import { useMemo } from "react";
import { Money } from "@/features/game/components/Money";
import { useGameLoop } from "@/features/game/hooks/useGameLoop";
import useGameStore from "@/features/game/store/useGameStore";
import { EventNotificationDialog } from "@/features/game/components/EventNotificationDialog";
import { ProductionFacilities } from "@/features/game/components/ProductionFacilities";
import { TapZone } from "@/features/game/components/TapZone";
import { OpeningStory } from "@/features/game/components/OpeningStory";

const GameLoop = () => {
  useGameLoop();
  return null;
};

export default function Home() {
  const productionLevels = useGameStore((s) => s.productionLevels);

  const items = useMemo(
    () => Object.entries(productionLevels).map(([id, level]) => ({ id, level })),
    [productionLevels]
  );

  return (
    <div>
      <GameLoop />
      <OpeningStory />
      <EventNotificationDialog />
      <div className="max-w-lg mx-auto py-4 flex flex-col gap-4">
        <div className="flex justify-end mr-4">
          <Money />
        </div>
        <ProductionFacilities items={items} />
        <TapZone />
      </div>
    </div>
  );
}
