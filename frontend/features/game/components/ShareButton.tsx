"use client";

import { useState } from "react";
import { Share } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useGameStore from "@/features/game/store/useGameStore";
import { ShareButtons } from "@/components/ShareButtons";
import numbro from "numbro";

const formatMoney = (n: number) =>
  n >= 1_000_000
    ? numbro(n).format({ average: true, mantissa: 1, trimMantissa: true })
    : numbro(n).format({ thousandSeparated: true, mantissa: 0 });

export const ShareButton = () => {
  const [open, setOpen] = useState(false);
  const money = useGameStore((s) => s.getMoney());
  const text = `新庄村ファーマーで ${formatMoney(money)} コイン貯めました！ #新庄村ファーマー`;

  return (
    <>
      <Card
        role="button"
        onClick={() => setOpen(true)}
        className="flex flex-row items-center gap-1 bg-[#b5d9a8] rounded-full px-3 py-1 shadow-sm w-fit border-none cursor-pointer active:scale-90 transition-transform"
      >
        <Share className="w-5 h-5 text-white" strokeWidth={2.5} />
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>シェア</DialogTitle>
          </DialogHeader>
          <ShareButtons text={text} />
        </DialogContent>
      </Dialog>
    </>
  );
};
