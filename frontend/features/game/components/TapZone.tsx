"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { tap } from "@/features/game/domain/tap";

export const TapZone = () => {
  return (
    <Card
      role="button"
      onPointerDown={(e) => {
        e.preventDefault();
        tap();
      }}
      className="flex justify-center items-center pt-5 bg-transparent border-none shadow-none ring-0 cursor-pointer select-none"
    >
      <Image
        src="/images/TapCarrotField.png"
        alt="TapField"
        width={320}
        height={320}
        loading="eager"
        priority
        draggable={false}
        className="mt-5"
      />
    </Card>
  );
};
