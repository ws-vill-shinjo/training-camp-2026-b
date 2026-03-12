"use client";

import Image from "next/image";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import useGameStore from "@/features/game/store/useGameStore";
import { calcCost, upgradeProduction } from "@/features/game/domain/economy";
import { calcYield, calcCycleMs } from "@/features/game/domain/production";
import { formatNumber } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = { id: string };

export function ProductionUpgradeItem({ id }: Props) {
  const level = useGameStore((s) => s.productionLevels[id] ?? 0);
  const money = useGameStore((s) => s.money);
  const effectiveStat = useGameStore((s) => s.effectiveProductionStats[id]);
  const registry = getMasterRegistry();
  const config = registry.production[id];
  if (!config) return null;

  const { name, imageSrc, maxLevel, qrUnlockEnabled } = config;
  const isMaxLevel = level >= maxLevel;
  const isQrLocked = level === 0 && qrUnlockEnabled;
  const cost = isMaxLevel ? null : calcCost(config, level + 1);
  const canAfford = cost ? Number(money) >= cost : false;

  const displayLevel = Math.max(level, 1);
  const displayYield = effectiveStat ? Number(effectiveStat.yield) : calcYield(config, displayLevel);
  const displayCycleSeconds = effectiveStat ? effectiveStat.cycleMs / 1000 : calcCycleMs(config) / 1000;

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
        ) : isQrLocked ? (
          <span className="text-xs font-semibold text-muted-foreground w-20 text-center">
            QRコードでアンロック
          </span>
        ) : (
          <Button
            size="sm"
            disabled={!canAfford}
            onClick={() => upgradeProduction(id, config)}
            className="flex-shrink-0 flex flex-col h-auto py-1 w-20 bg-[#6ab87a] hover:bg-[#57a567] text-white"
          >
            <span>{level === 0 ? "アンロック" : "強化"}</span>
            {cost && (
              <span className="text-xs opacity-80">{formatNumber(cost)}</span>
            )}
          </Button>
        )}
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>生産量: {formatNumber(displayYield)}</span>
        <span>生産時間: {displayCycleSeconds.toFixed(1)}秒</span>
      </div>
    </Card>
  );
}
