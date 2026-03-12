"use client";

import { Share } from "lucide-react";
import { Card } from "@/components/ui/card";
import useGameStore from "@/features/game/store/useGameStore";
import numbro from "numbro";

const formatMoney = (n: number) =>
  n >= 1_000_000
    ? numbro(n).format({ average: true, mantissa: 1, trimMantissa: true })
    : numbro(n).format({ thousandSeparated: true, mantissa: 0 });

export const ShareButton = () => {
  const money = useGameStore((s) => s.getMoney());

  const handleShare = async () => {
    const text = `新庄村ファーマーで ${formatMoney(money)} コイン貯めました！ #新庄村ファーマー`;
    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <Card
      role="button"
      onClick={handleShare}
      className="flex flex-row items-center gap-1 bg-[#b5d9a8] rounded-full px-3 py-1 shadow-sm w-fit border-none cursor-pointer active:scale-90 transition-transform"
    >
      <Share className="w-5 h-5 text-white" strokeWidth={2.5} />
    </Card>
  );
};
