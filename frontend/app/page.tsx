"use client";
import { Header } from "@/components/Header";
import { Upgradecard } from "@/components/Upgrade_card";

export default function Home() {
  return (
    <>
      <div>
        <Header>
          <h1 className="text-4xl">ホーム</h1>
        </Header>
      </div>
      <div>
        <Upgradecard label="じゃがいも" lv={1} />
      </div>
    </>
  );
}
