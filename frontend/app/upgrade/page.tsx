"use client";

import { useEffect } from "react";
import { Header } from "@/components/Header";
import useGameStore from "@/features/game/store/useGameStore";
import { Money } from "@/features/game/components/Money";
import { ProductionUpgradeItem } from "@/features/upgrade/components/ProductionUpgradeItem";
import { BonusUpgradeItem } from "@/features/upgrade/components/BonusUpgradeItem";
import { useUpgradeIds } from "@/features/upgrade/hooks/useUpgradeIds";

export default function UpgradePage() {
  const { registryReady, productionIds, bonusIds } = useUpgradeIds();

  useEffect(() => {
    if (!registryReady) return;
    const store = useGameStore.getState();
    store.rebuildBaseProductionStats();
    store.rebuildRuntimeModifiers();
    store.rebuildEffectiveProductionStats();
  }, [registryReady]);

  if (!registryReady) {
    return (
      <>
        <Header>
          <h1 className="text-4xl">素材強化</h1>
        </Header>
        <div className="max-w-lg mx-auto p-4 text-sm text-muted-foreground">読み込み中...</div>
      </>
    );
  }

  return (
    <>
      <Header>
        <h1 className="text-4xl">素材強化</h1>
      </Header>
      <div className="px-4 py-4 flex justify-end">
        <Money />
      </div>
      <div className="max-w-lg mx-auto px-4 space-y-2 py-3">
        <p className="text-sm font-bold text-muted-foreground">施設一覧</p>
        {productionIds.map((id) => (
          <ProductionUpgradeItem key={id} id={id} />
        ))}
      </div>
      <div className="max-w-lg mx-auto px-4 space-y-2 py-3">
        <p className="text-sm font-bold text-muted-foreground">ボーナス一覧</p>
        {bonusIds.map((id) => (
          <BonusUpgradeItem key={id} id={id} />
        ))}
      </div>
    </>
  );
}
