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
import Image from "next/image";

type PendingEvent = {
  master: EventMaster;
};

export const EventNotificationDialog = () => {
  const [queue, setQueue] = useState<PendingEvent[]>([]);

  useEffect(() => {
    const unbind = gameEventEmitter.on("eventActivated", (_event, master) => {
      setQueue((prev) => [...prev, { master }]);
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
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={current.master.imageSrc}
              alt={current.master.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>{current?.master.name}</DialogTitle>
          <DialogDescription>{current?.master.flavorText}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
