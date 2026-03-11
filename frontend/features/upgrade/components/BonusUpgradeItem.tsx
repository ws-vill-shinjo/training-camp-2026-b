"use client";

import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import useGameStore from "@/features/game/store/useGameStore";
import { calcCost } from "@/features/game/domain/economy";
import { calcEffect, upgradeBonus } from "@/features/game/domain/bonus";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = { id: string };

export function BonusUpgradeItem({ id }: Props) {
  const level = useGameStore((s) => s.bonusLevels[id] ?? 0);
  const money = useGameStore((s) => s.money);

  const config = getMasterRegistry().bonus[id];
  if (!config) return null;

  const { name, imageSrc, maxLevel, qrUnlockEnabled } = config;
  const isMaxLevel = level >= maxLevel;
  const isQrLocked = level === 0 && qrUnlockEnabled;
  const cost = isMaxLevel ? null : calcCost(config, level + 1);
  const canAfford = cost ? Number(money) >= cost : false;
  const displayLevel = isMaxLevel ? level : level + 1;
  const multiplier = calcEffect(config, displayLevel);
  const increasePercent = ((multiplier - 1) * 100).toFixed(0);
  const effectLabel = config.effectType === "yieldMultiplier" ? "生産量上昇" : "生産速度上昇";

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
            {cost && <span className="text-xs opacity-80">{formatNumber(cost)}</span>}
          </Button>
        )}
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>
          {effectLabel}: +{increasePercent}%
        </span>
      </div>
    </Card>
  );
}
