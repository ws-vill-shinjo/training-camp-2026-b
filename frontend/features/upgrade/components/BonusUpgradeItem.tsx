"use client";

import numbro from "numbro";
import Image from "next/image";
import Decimal from "decimal.js";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import useGameStore from "@/features/game/store/useGameStore";
import { calcCost } from "@/features/game/domain/economy";
import { upgradeBonus } from "@/features/game/domain/bonus";
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
  const canAfford = cost ? new Decimal(money).gte(cost) : false;

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
          onClick={() => upgradeBonus(id, config)}
          className="flex-shrink-0 flex flex-col h-auto py-1 w-20 bg-[#6ab87a] hover:bg-[#57a567] text-white"
        >
          <span>{level === 0 ? "アンロック" : "強化"}</span>
          {cost && (
            <span className="text-xs opacity-80">{numbro(cost).format({ average: true })}</span>
          )}
        </Button>
      )}
    </Card>
  );
}
