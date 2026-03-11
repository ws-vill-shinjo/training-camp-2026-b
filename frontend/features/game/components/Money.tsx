"use client";

import dynamic from "next/dynamic";
import numbro from "numbro";
import { Card } from "@/components/ui/card";
import useGameStore from "@/features/game/store/useGameStore";
import { CircleDollarSignIcon } from "lucide-react";

const MoneyComponent = () => {
  const value = useGameStore((s) => s.getMoney());
  const formattedMoney =
    value >= 1_000_000
      ? numbro(value).format({ average: true }).toUpperCase()
      : numbro(value).format({ thousandSeparated: true, mantissa: 0 });

  return (
    <Card className="flex flex-row items-center gap-1 bg-[#b5d9a8] rounded-full px-3 py-1 shadow-sm w-fit min-w-[100px] justify-center border-none">
      <span className="text-yellow-400 text-base">
        <CircleDollarSignIcon />
      </span>
      <span className="text-white font-bold text-sm">{formattedMoney}</span>
    </Card>
  );
};

export const Money = dynamic(() => Promise.resolve(MoneyComponent), { ssr: false });
