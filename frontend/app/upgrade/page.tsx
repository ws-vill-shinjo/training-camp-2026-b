"use client";

import numbro from "numbro";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import useGameStore from "@/features/game/store/useGameStore";
import { calcCost } from "@/features/game/domain/economy";
import { upgradeProduction } from "@/features/game/domain/economy";
import { upgradeBonus, calcEffect } from "@/features/game/domain/bonus";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Decimal from "decimal.js";
import Image from "next/image";
import { Money } from "@/features/game/components/Money";

function ProductionItem({
  id,
  name,
  imageSrc,
  level,
  maxLevel,
  money,
  effectiveStat,
}: {
  id: string;
  name: string;
  imageSrc: string;
  level: number;
  maxLevel: number;
  money: string;
  effectiveStat?: { yield: string; cycleMs: number };
}) {
  const registry = getMasterRegistry();
  const config = registry.production[id];
  const isMaxLevel = level >= maxLevel;
  const isQrLocked = level === 0 && config.qrUnlockEnabled;
  const nextLevel = level + 1;
  const cost = isMaxLevel ? null : calcCost(config, nextLevel);
  const canAfford = cost ? new Decimal(money).gte(cost) : false;

  const handleUpgrade = () => {
    upgradeProduction(id, config);
  };

  const displayYield = level > 0 && effectiveStat ? effectiveStat.yield : "0";
  const displayCycleSeconds = level > 0 && effectiveStat ? effectiveStat.cycleMs / 1000 : 0;

  return (
    <Card className="flex-col gap-2 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Image
            src={imageSrc}
            alt={name}
            width={48}
            height={48}
            className="rounded-md object-cover"
          />
        </div>
        <p className="font-semibold text-sm flex-1 truncate">{name}</p>
        <p className="text-xs text-muted-foreground w-16 flex-shrink-0 text-center">
          Lv.{level} / {maxLevel}
        </p>
        {isMaxLevel ? (
          <span className="text-xs font-semibold text-muted-foreground w-14 text-center">MAX</span>
        ) : isQrLocked ? (
          <span className="text-xs font-semibold text-muted-foreground w-20 text-center">
            QRコードでアンロック
          </span>
        ) : (
          <Button
            size="sm"
            disabled={!canAfford}
            onClick={handleUpgrade}
            className="flex-shrink-0 flex flex-col h-auto py-1 w-20 bg-[#6ab87a] hover:bg-[#57a567] text-white"
          >
            <span>{level === 0 ? "アンロック" : "強化"}</span>
            {cost && (
              <span className="text-xs opacity-80">{numbro(cost).format({ average: true })}</span>
            )}
          </Button>
        )}
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>生産量: {numbro(displayYield).format({ average: true })}</span>
        <span>生産時間: {displayCycleSeconds.toFixed(1)}秒</span>
      </div>
    </Card>
  );
}

function BonusItem({
  id,
  name,
  imageSrc,
  level,
  maxLevel,
  money,
}: {
  id: string;
  name: string;
  imageSrc: string;
  level: number;
  maxLevel: number;
  money: string;
}) {
  const config = getMasterRegistry().bonus[id];
  const isMaxLevel = level >= maxLevel;
  const isQrLocked = level === 0 && config.qrUnlockEnabled;
  const cost = isMaxLevel ? null : calcCost(config, level + 1);
  const canAfford = cost ? new Decimal(money).gte(cost) : false;
  const currentMultiplier = level > 0 ? calcEffect(config, level).toNumber() : 1;
  const yieldIncreasePercent = ((currentMultiplier - 1) * 100).toFixed(0);

  return (
    <Card className="flex-col gap-2 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Image
            src={imageSrc}
            alt={name}
            width={48}
            height={48}
            className="rounded-md object-cover"
          />
        </div>
        <p className="font-semibold text-sm flex-1 truncate">{name}</p>
        <p className="text-xs text-muted-foreground w-16 flex-shrink-0 text-center">
          Lv.{level} / {maxLevel}
        </p>
        {isMaxLevel ? (
          <span className="text-xs font-semibold text-muted-foreground w-14 text-center">MAX</span>
        ) : isQrLocked ? (
          <span className="text-xs font-semibold text-muted-foreground w-20 text-center">
            QRコードでアンロック
          </span>
        ) : (
          <Button
            size="sm"
            disabled={!canAfford}
            onClick={() => upgradeBonus(id, config)}
            className="flex-shrink-0 flex flex-col h-auto py-1 w-20 bg-[#6ab87a] hover:bg-[#57a567] text-white"
          >
            <span>{level === 0 ? "アンロック" : "強化"}</span>
            {cost && (
              <span className="text-xs opacity-80">{numbro(cost).format({ average: true })}</span>
            )}
          </Button>
        )}
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>生産量上昇: +{yieldIncreasePercent}%</span>
      </div>
    </Card>
  );
}

export default function UpgradePage() {
  const registryReady = useGameStore((s) => s.registryReady);
  const productionLevels = useGameStore((s) => s.productionLevels);
  const bonusLevels = useGameStore((s) => s.bonusLevels);
  const money = useGameStore((s) => s.money);
  const effectiveProductionStats = useGameStore((s) => s.effectiveProductionStats);

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

  const registry = getMasterRegistry();
  const productions = Object.values(registry.production);
  const bonuses = Object.values(registry.bonus);

  return (
    <>
      <Header>
        <h1 className="text-4xl">素材強化</h1>
      </Header>
      <div className="max-w-lg mx-auto">
        <Money />
        <div className="px-4 space-y-2 py-3">
          <p className="text-sm font-bold text-muted-foreground">施設一覧</p>
          {productions.map((p) => (
            <ProductionItem
              key={p.id}
              id={p.id}
              name={p.name}
              imageSrc={p.imageSrc}
              level={productionLevels[p.id] ?? 0}
              maxLevel={p.maxLevel}
              money={money}
              effectiveStat={effectiveProductionStats[p.id]}
            />
          ))}
        </div>
        <div className="px-4 space-y-2 py-3">
          <p className="text-sm font-bold text-muted-foreground">ボーナス一覧</p>
          {bonuses.map((b) => (
            <BonusItem
              key={b.id}
              id={b.id}
              name={b.name}
              imageSrc={b.imageSrc}
              level={bonusLevels[b.id] ?? 0}
              maxLevel={b.maxLevel}
              money={money}
            />
          ))}
        </div>
      </div>
    </>
  );
}
