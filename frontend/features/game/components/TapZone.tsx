"use client";

import { AnimatePresence } from "motion/react";
import { FloatingLabel } from "./FloatingLabel";
import { useState, useEffect, useRef } from "react";
import { tap } from "@/features/game/domain/tap";
import useGameStore from "@/features/game/store/useGameStore";
import { FieldSVG } from "./DaikonSVG";

type FloatingLabelType = {
  id: number;
  x: number;
  y: number;
  amount: number;
};

export const TapZone = () => {
  const tapYield = useGameStore((s) => s.tapYield);
  const [labels, setLabels] = useState<FloatingLabelType[]>([]);
  const [tapped, setTapped] = useState(false);
  const [carrotCount, setCarrotCount] = useState(1);
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    fetch("/sounds/drop_money.mp3")
      .then((res) => res.arrayBuffer())
      .then((arr) => ctx.decodeAudioData(arr))
      .then((buf) => {
        bufferRef.current = buf;
      });

    return () => {
      ctx.close();
    };
  }, []);

  const playSound = () => {
    const ctx = ctxRef.current;
    const buf = bufferRef.current;
    if (!ctx || !buf) return;
    if (ctx.state === "suspended") ctx.resume();
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    playSound();
    tap();
    setTapped(true);
    setCarrotCount((prev) => (prev % 6) + 1);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLabels((prev) => [
      ...prev,
      { id: Date.now(), x, y, amount: Math.round(Number(tapYield ?? 1)) },
    ]);
  };

  return (
    <div
      role="button"
      onPointerDown={handlePointerDown}
      className="relative flex justify-center items-center bg-transparent border-none shadow-none ring-0 cursor-pointer select-none"
    >
      <FieldSVG count={carrotCount} tapped={tapped} onAnimationComplete={() => setTapped(false)} />
      <AnimatePresence>
        {labels.map((label) => (
          <FloatingLabel
            key={label.id}
            {...label}
            onComplete={(id) => setLabels((prev) => prev.filter((l) => l.id !== id))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
