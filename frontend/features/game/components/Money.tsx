"use client";

import dynamic from "next/dynamic";
import numbro from "numbro";
import CountUp from "react-countup";
import { Card } from "@/components/ui/card";
import useGameStore from "@/features/game/store/useGameStore";
import { CircleDollarSignIcon } from "lucide-react";
import { memo } from "react";

const formatMoney = (n: number) =>
  n >= 1_000_000
    ? numbro(n).format({ average: true, mantissa: 1, trimMantissa: true })
    : numbro(n).format({ thousandSeparated: true, mantissa: 0 });

const MoneyComponent = memo(function MoneyComponent() {
  const value = useGameStore((s) => s.getMoney());

  return (
    <Card className="flex flex-row items-center gap-1 bg-[#b5d9a8] rounded-full px-3 py-1 shadow-sm w-fit min-w-[100px] justify-center border-none">
      <span className="text-yellow-400 text-base">
        <CircleDollarSignIcon />
      </span>
      <span className="text-white font-bold text-sm">
        <CountUp end={value} duration={0.4} preserveValue formattingFn={formatMoney} />
      </span>
    </Card>
  );
});

export const Money = dynamic(() => Promise.resolve(MoneyComponent), { ssr: false });
