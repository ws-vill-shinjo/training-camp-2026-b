"use client";

import { useState } from "react";
import { EncyclopediaGridItem } from "./EncyclopediaGridItem";
import { EncyclopediaDetail } from "./EncyclopediaDetail";
import type { EncyclopediaEntry } from "../hooks/useEncyclopediaEntries";
import { SECTION_ORDER, SECTION_LABEL } from "../types/encyclopedia";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  entries: EncyclopediaEntry[];
};

export const EncyclopediaList = ({ entries }: Props) => {
  const [selected, setSelected] = useState<EncyclopediaEntry | null>(null);

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">図鑑データが見つかりません。</p>;
  }

  const grouped = SECTION_ORDER.reduce<Record<string, EncyclopediaEntry[]>>((acc, type) => {
    acc[type] = entries.filter((e) => e.sourceType === type);
    return acc;
  }, {});

  return (
    <>
      <div className="space-y-8">
        {SECTION_ORDER.map((type) => {
          const section = grouped[type];
          if (section.length === 0) return null;

          const unlockedCount = section.filter((e) => e.unlocked).length;

          return (
            <section key={type}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-semibold">{SECTION_LABEL[type]}</h2>
                <span className="text-xs text-muted-foreground">
                  {unlockedCount} / {section.length}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {section.map((entry) => (
                  <EncyclopediaGridItem key={entry.id} entry={entry} onSelect={setSelected} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && <EncyclopediaDetail entry={selected} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
