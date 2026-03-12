"use client";

import { useMemo } from "react";
import { Money } from "@/features/game/components/Money";
import { useGameLoop } from "@/features/game/hooks/useGameLoop";
import useGameStore from "@/features/game/store/useGameStore";
import { EventNotificationDialog } from "@/features/game/components/EventNotificationDialog";
import { ProductionFacilities } from "@/features/game/components/ProductionFacilities";
import { TapZone } from "@/features/game/components/TapZone";
import { OpeningStory } from "@/features/game/components/OpeningStory";
import { RiverBackground } from "@/features/game/components/RiverBackground";
import { ShareButton } from "@/features/game/components/ShareButton";

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
    <div className="overflow-hidden">
      <RiverBackground />
      <GameLoop />
      <OpeningStory />
      <EventNotificationDialog />
      <div className="max-w-lg mx-auto py-4 flex flex-col gap-4 h-[calc(100dvh-12rem)]">
        <div className="flex justify-between items-center mx-4 flex-shrink-0">
          <ShareButton />
          <Money />
        </div>
        <div className="flex-1 min-h-0">
          <ProductionFacilities items={items} />
        </div>
        <div className="flex-shrink-0">
          <TapZone />
        </div>
      </div>
    </div>
  );
}
