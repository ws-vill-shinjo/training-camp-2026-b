"use client";

import { useEncyclopediaEntries } from "@/features/encyclopedia/hooks/useEncyclopediaEntries";
import { EncyclopediaList } from "@/features/encyclopedia/components/EncyclopediaList";
import { mockEncyclopediaEntries } from "@/features/encyclopedia/mocks/encyclopediaMock";
import { Header } from "@/components/Header";

const USE_MOCK = true;

export default function EncyclopediaPage() {
  const fetched = useEncyclopediaEntries();
  const entries = USE_MOCK ? mockEncyclopediaEntries : fetched;

  return (
    <>
      <Header>
        <h1 className="text-4xl">図鑑</h1>
      </Header>
      <div className="p-4">
        <EncyclopediaList entries={entries} />
      </div>
    </>
  );
}
