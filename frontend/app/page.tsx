"use client";

import { Facility } from "@/components/Facility";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TapZone } from "@/components/TapZone";

export default function HOME() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Home" />
      <main className="flex-1 bg-[#f0f9ec] p-4">
        <Facility />
        <TapZone />
      </main>
      <Footer />
    </div>
  );
}
