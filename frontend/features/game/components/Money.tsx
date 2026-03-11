"use client";
import numbro from "numbro";
import { Card } from "@/components/ui/card";
import useGameStore from "@/features/game/store/useGameStore";

export const Money = () => {
  const getMoneyDecimal = useGameStore((s) => s.getMoneyDecimal);

  useGameStore((s) => s.money);
  const value = getMoneyDecimal().toNumber();
  const formattedMoney =
    value >= 1_000_000
      ? numbro(value).format({ average: true }).toUpperCase()
      : numbro(value).format({ thousandSeparated: true, mantissa: 0 });

  return (
    <Card className="flex flex-row items-center gap-1 bg-[#b5d9a8] rounded-full px-3 py-1 shadow-sm w-fit min-w-[100px] justify-center border-none">
      <span className="text-yellow-400 text-base">🪙</span>
      <span className="text-white font-bold text-sm">{formattedMoney}</span>
    </Card>
  );
};
