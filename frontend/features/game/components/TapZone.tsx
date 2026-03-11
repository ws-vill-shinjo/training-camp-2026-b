"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { tap } from "@/features/game/domain/tap";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CircleDollarSignIcon } from "lucide-react";
import useGameStore from "../store/useGameStore";

type FloatingLabel = {
  id: number;
  x: number;
  y: number;
};

const store = useGameStore.getState();

export const TapZone = () => {
  const [labels, setLabels] = useState<FloatingLabel[]>([]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    tap();

    // カード内の相対座標を取得
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setLabels((prev) => [...prev, { id: Date.now(), x, y }]);
  };

  return (
    <Card
      role="button"
      onPointerDown={handlePointerDown}
      className="relative flex justify-center items-center pt-5 bg-transparent border-none shadow-none ring-0 cursor-pointer select-none"
    >
      <Image
        src="/images/TapCarrotField.png"
        alt="potato"
        width={320}
        height={320}
        draggable={false}
        className="mt-5"
      />

      <AnimatePresence>
        {labels.map((label) => (
          <motion.span
            key={label.id}
            initial={{ opacity: 1, y: 0, x: "-50%" }}
            animate={{ opacity: 0, y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={() => setLabels((prev) => prev.filter((l) => l.id !== label.id))}
            className="absolute pointer-events-none text-green-600 font-bold text-xl drop-shadow"
            style={{ left: label.x, top: label.y }}
          >
            <div className="flex items-center gap-1 text-yellow-400">
              <CircleDollarSignIcon size={20} />
              <span>+{store.tapYield}</span>
            </div>
          </motion.span>
        ))}
      </AnimatePresence>
    </Card>
  );
};
