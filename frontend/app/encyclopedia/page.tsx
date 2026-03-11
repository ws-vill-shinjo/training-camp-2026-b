"use client";

import { useEncyclopediaEntries } from "@/features/encyclopedia/hooks/useEncyclopediaEntries";
import { EncyclopediaList } from "@/features/encyclopedia/components/EncyclopediaList";

export default function EncyclopediaPage() {
  const entries = useEncyclopediaEntries();

  return (
    <main className="container py-4">
      <h1 className="text-lg font-semibold mb-4">図鑑</h1>
      <EncyclopediaList entries={entries} />
    </main>
  );
}
