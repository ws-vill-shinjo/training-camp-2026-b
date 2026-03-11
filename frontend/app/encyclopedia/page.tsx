"use client";

import { useEncyclopediaEntries } from "@/features/encyclopedia/hooks/useEncyclopediaEntries";
import { EncyclopediaList } from "@/features/encyclopedia/components/EncyclopediaList";
import { Header } from "@/components/Header";

export default function EncyclopediaPage() {
  const entries = useEncyclopediaEntries();

  return (
    <>
      <Header>
        <h1 className="text-4xl">ライブラリ</h1>
      </Header>
      <div className="max-w-lg mx-auto p-4">
        <EncyclopediaList entries={entries} />
      </div>
    </>
  );
}
