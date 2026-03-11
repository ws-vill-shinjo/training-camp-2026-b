"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import useGameStore from "@/features/game/store/useGameStore";
import { Money } from "@/features/game/components/Money";
import { useGameLoop } from "@/features/game/hooks/useGameLoop";
import { ProductionUpgradeItem } from "@/features/upgrade/components/ProductionUpgradeItem";
import { BonusUpgradeItem } from "@/features/upgrade/components/BonusUpgradeItem";
import { TapUpgradeItem } from "@/features/upgrade/components/TapUpgradeItem";
import { useUpgradeIds } from "@/features/upgrade/hooks/useUpgradeIds";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

const GameLoop = () => {
  useGameLoop();
  return null;
};

export default function UpgradePage() {
  const router = useRouter();
  const { productionIds, bonusIds } = useUpgradeIds();

  useEffect(() => {
    const store = useGameStore.getState();
    store.rebuildBaseProductionStats();
    store.rebuildRuntimeModifiers();
    store.rebuildEffectiveProductionStats();
  }, []);

  return (
    <>
      <GameLoop />
      <div className="max-w-lg mx-auto p-4">
        <div className="flex justify-between">
          <Button
            onClick={() => router.push("/unlock")}
            className="flex items-center gap-2 bg-[#6ab87a] shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2 font-semibold"
          >
            <QrCode className="w-5 h-5" />
            QRコード
          </Button>
          <Money />
        </div>
        <div className="space-y-2 py-3 mt-4">
          <p className="text-base font-bold text-black">タップ強化</p>
          <TapUpgradeItem />
        </div>
        <div className="space-y-2 py-3">
          <p className="text-base font-bold text-black">生産強化</p>
          {productionIds.map((id) => (
            <ProductionUpgradeItem key={id} id={id} />
          ))}
        </div>
        <div className="space-y-2 py-3">
          <p className="text-base font-bold text-black">ボーナス強化</p>
          {bonusIds.map((id) => (
            <BonusUpgradeItem key={id} id={id} />
          ))}
        </div>
      </div>
    </>
  );
}
