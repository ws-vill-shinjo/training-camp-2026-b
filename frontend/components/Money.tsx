"use client";
import numbro from "numbro";
const money = 20000000;

export const Money = () => {
  const formattedMoney = numbro(money).format({ average: true });
  return (
    <div className="flex items-center ml-auto mr-4 mt-2 gap-1 border bg-[#b5d9a8] rounded-full px-3 py-1 shadow-sm w-fit min-w-[100px] justify-center">
      <span className="text-yellow-400 text-base">🪙</span>
      <span className="text-white font-bold text-xs ml-1">お金</span>
      <span className="text-white font-bold text-sm">¥{formattedMoney}</span>
    </div>
  );
};
