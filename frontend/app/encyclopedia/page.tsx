"use client";

import { useEncyclopediaEntries } from "@/features/encyclopedia/hooks/useEncyclopediaEntries";
import { EncyclopediaList } from "@/features/encyclopedia/components/EncyclopediaList";

export default function EncyclopediaPage() {
  const entries = useEncyclopediaEntries();

  return (
    <div>
      <EncyclopediaList entries={entries} />
    </div>
  );
}
