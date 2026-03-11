"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AnimatePresence } from "motion/react";
import { FloatingLabel } from "./FloatingLabel";
import { useState } from "react";
import { tap } from "@/features/game/domain/tap";

// 型を別途定義
type FloatingLabelType = {
  id: number;
  x: number;
  y: number;
};

export const TapZone = () => {
  const [labels, setLabels] = useState<FloatingLabelType[]>([]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    tap();
    const rect = e.currentTarget.getBoundingClientRect();
    setLabels((prev) => [
      ...prev,
      { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
  };

  return (
    <Card
      role="button"
      onPointerDown={handlePointerDown}
      className="relative flex justify-center items-center pt-5 bg-transparent border-none shadow-none ring-0 cursor-pointer select-none"
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
      <AnimatePresence>
        {labels.map((label) => (
          <FloatingLabel
            key={label.id}
            {...label}
            onComplete={(id) => setLabels((prev) => prev.filter((l) => l.id !== id))}
          />
        ))}
      </AnimatePresence>
    </Card>
  );
};
