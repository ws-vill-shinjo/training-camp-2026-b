"use client";

import { useState } from "react";
import { EncyclopediaGridItem } from "./EncyclopediaGridItem";
import { EncyclopediaDetail } from "./EncyclopediaDetail";
import type { EncyclopediaEntry } from "../types/encyclopedia";
import { SECTION_ORDER, SECTION_LABEL } from "../types/encyclopedia";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
            <Card key={type}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-black">{SECTION_LABEL[type]}</p>
                  <span className="text-xs text-muted-foreground">
                    {unlockedCount} / {section.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-x-4 gap-y-6">
                  {section.map((entry) => (
                    <EncyclopediaGridItem key={entry.id} entry={entry} onSelect={setSelected} />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <EncyclopediaDetail entry={selected} onClose={() => setSelected(null)} />
    </>
  );
};
