"use client";

import { useEncyclopediaEntries } from "@/features/encyclopedia/hooks/useEncyclopediaEntries";
import { EncyclopediaList } from "@/features/encyclopedia/components/EncyclopediaList";

export default function EncyclopediaPage() {
  const entries = useEncyclopediaEntries();

  return (
    <div className="max-w-lg mx-auto p-4">
      <EncyclopediaList entries={entries} />
    </div>
  );
}
