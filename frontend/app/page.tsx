"use client";
import { Header } from "@/components/Header";
import { useGameLoop } from "@/features/game/hooks/useGameLoop";
import useGameStore from "@/features/game/store/useGameStore";
import { EventNotificationDialog } from "@/features/game/components/EventNotificationDialog";

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
      <div className="max-w-lg mx-auto p-4">TBD</div>
    </div>
  );
}
