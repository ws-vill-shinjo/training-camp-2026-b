"use client";

import { useEncyclopediaEntries } from "@/features/encyclopedia/hooks/useEncyclopediaEntries";
import { EncyclopediaList } from "@/features/encyclopedia/components/EncyclopediaList";
import { mockEncyclopediaEntries } from "@/features/encyclopedia/mocks/encyclopediaMock";

const USE_MOCK = true;

export default function EncyclopediaPage() {
  const fetched = useEncyclopediaEntries();
  const entries = USE_MOCK ? mockEncyclopediaEntries : fetched;

  return (
    <div>
      <EncyclopediaList entries={entries} />
    </div>
  );
}
