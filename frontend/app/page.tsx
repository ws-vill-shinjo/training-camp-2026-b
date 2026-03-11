"use client";
import { Header } from "@/components/Header";
import { Upgrade_card } from "@/components/Upgrade_card";

export default function Home() {
  return (
    <div>
      <Header title="Home" />;
      <Upgrade_card name="ジャガイモ" />;
    </div>
  );
}
