"use client";

import { useEffect, useState } from "react";
import { gameEventEmitter } from "../domain/event";
import type { EventMaster } from "../../../master/schema/eventSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

type PendingEvent = {
  master: EventMaster;
  amount: number;
};

export const EventNotificationDialog = () => {
  const [queue, setQueue] = useState<PendingEvent[]>([]);

  useEffect(() => {
    const unbind = gameEventEmitter.on("eventActivated", (event, master) => {
      setQueue((prev) => [...prev, { master, amount: Number(event.value) }]);
    });
    return unbind;
  }, []);

  const current = queue[0];
  const open = queue.length > 0;

  const handleClose = () => {
    setQueue((prev) => prev.slice(1));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent showCloseButton={false}>
        {current?.master.imageSrc && (
          <Card className="relative aspect-square w-full overflow-hidden rounded-lg p-0">
            <Image
              src={current.master.imageSrc}
              alt={current.master.name}
              fill
              className="object-cover"
            />
          </Card>
        )}
        <DialogHeader>
          <DialogTitle>{current?.master.name}</DialogTitle>
          <DialogDescription>{current?.master.flavorText}</DialogDescription>
        </DialogHeader>
        {current && (
          <p className={`text-center text-lg font-bold ${current.master.effectType === "moneyGain" ? "text-green-600" : "text-red-600"}`}>
            {current.master.effectType === "moneyGain" ? "+" : "-"}{current.amount.toLocaleString()} コイン
          </p>
        )}
        <DialogFooter>
          <Button onClick={handleClose} className="bg-[#B5D9A8] text-[#484234] hover:bg-[#9fcb91] w-full">OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
