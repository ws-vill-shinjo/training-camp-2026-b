"use client";

import numbro from "numbro";
import Image from "next/image";
import Decimal from "decimal.js";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import useGameStore from "@/features/game/store/useGameStore";
import { calcCost } from "@/features/game/domain/economy";
import { calcTapYield, TAP_MASTER_ID } from "@/features/game/domain/tap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TapUpgradeItem() {
  const level = useGameStore((s) => s.tapLevel);
  const money = useGameStore((s) => s.money);

  const config = getMasterRegistry().tap[TAP_MASTER_ID];
  const { name, imageSrc, maxLevel } = config;
  const isMaxLevel = level >= maxLevel;
  const cost = isMaxLevel ? null : calcCost(config, level + 1);
  const canAfford = cost ? new Decimal(money).gte(cost) : false;

  const currentYield = calcTapYield(config, level);

  const handleUpgrade = () => {
    const store = useGameStore.getState();
    if (cost && !new Decimal(store.money).gte(cost)) return;
    if (cost) store.spendMoney(cost);
    store.upgradeTapLevel();
    store.rebuildTapYield();
  };

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
          <span className="text-xs font-semibold text-muted-foreground w-20 text-center">MAX</span>
        ) : (
          <Button
            size="sm"
            disabled={!canAfford}
            onClick={handleUpgrade}
            className="flex-shrink-0 flex flex-col h-auto py-1 w-20 bg-[#6ab87a] hover:bg-[#57a567] text-white"
          >
            <span>強化</span>
            {cost && (
              <span className="text-xs opacity-80">{numbro(cost).format({ average: true })}</span>
            )}
          </Button>
        )}
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>タップ収益: {numbro(currentYield.toNumber()).format({ average: true })}</span>
      </div>
    </Card>
  );
}
