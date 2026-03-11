"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Upgrade_card } from "@/components/Upgrade_card";

export default function Home() {
  return (
    <div>
      <Header title="Home" />
      <Footer />
      <Upgrade_card name="じゃがいも" level={1} />
    </div>
  );
}
