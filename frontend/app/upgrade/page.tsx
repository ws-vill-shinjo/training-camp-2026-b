"use client";

import { Header } from "@/components/Header";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import useGameStore from "@/features/game/store/useGameStore";
import { calcCost } from "@/features/game/domain/economy";
import { upgradeProduction } from "@/features/game/domain/economy";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Decimal from "decimal.js";
import Image from "next/image";

function formatNumber(value: Decimal | number | string): string {
  const d = new Decimal(value);
  if (d.gte(1_000_000_000)) return d.div(1_000_000_000).toFixed(2) + "B";
  if (d.gte(1_000_000)) return d.div(1_000_000).toFixed(2) + "M";
  if (d.gte(1_000)) return d.div(1_000).toFixed(2) + "K";
  return d.toFixed(0);
}

function ProductionItem({
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

  return (
    <Card className="flex-row items-center gap-3 px-4 py-3">
      <div className="flex-shrink-0">
        <Image
          src={imageSrc}
          alt={name}
          width={48}
          height={48}
          className="rounded-md object-cover"
        />
      </div>
      <p className="font-semibold text-sm w-28 flex-shrink-0 truncate">{name}</p>
      <p className="text-xs text-muted-foreground w-16 flex-shrink-0 text-center">
        Lv.{level} / {maxLevel}
      </p>
      <div className="flex-1" />
      {isMaxLevel ? (
        <span className="text-xs font-semibold text-muted-foreground w-14 text-center">MAX</span>
      ) : isQrLocked ? (
        <span className="text-xs font-semibold text-muted-foreground w-14 text-center">
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
          {cost && <span className="text-xs opacity-80">{formatNumber(cost)}</span>}
        </Button>
      )}
    </Card>
  );
}

export default function UpgradePage() {
  const registryReady = useGameStore((s) => s.registryReady);
  const productionLevels = useGameStore((s) => s.productionLevels);
  const money = useGameStore((s) => s.money);

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

  const productions = Object.values(getMasterRegistry().production);

  return (
    <>
      <Header>
        <h1 className="text-4xl">素材強化</h1>
      </Header>
      <div className="max-w-lg mx-auto p-4">
        <p className="text-right text-sm font-semibold">所持金: {money}</p>
      </div>
      <div className="max-w-lg mx-auto px-4 space-y-2 py-3">
        {productions.map((p) => (
          <ProductionItem
            key={p.id}
            id={p.id}
            name={p.name}
            imageSrc={p.imageSrc}
            level={productionLevels[p.id] ?? 0}
            maxLevel={p.maxLevel}
            money={money}
          />
        ))}
      </div>
    </>
  );
}
