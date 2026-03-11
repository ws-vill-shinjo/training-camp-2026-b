"use client";
import { Header } from "@/components/Header";
import { useGameLoop } from "@/features/game/hooks/useGameLoop";
import useGameStore from "@/features/game/store/useGameStore";
import { EventNotificationDialog } from "@/features/game/components/EventNotificationDialog";
import { Facility } from "@/components/Facility";
import { TapZone } from "@/components/TapZone";

const GameLoop = () => {
  useGameLoop();
  return null;
};

export default function Home() {
  const registryReady = useGameStore((s) => s.registryReady);

  return (
    <div>
      {registryReady && <GameLoop />}
      <EventNotificationDialog />
      <Header>
        <h1 className="text-4xl">ホーム</h1>
      </Header>
      <main>
        <Facility />
        <TapZone />
      </main>
    </div>
  );
}
