"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AnimatePresence } from "motion/react";
import { FloatingLabel } from "./FloatingLabel";
import { useState, useEffect, useRef } from "react";
import { tap } from "@/features/game/domain/tap";
import useGameStore from "@/features/game/store/useGameStore";

type FloatingLabelType = {
  id: number;
  x: number;
  y: number;
  amount: number;
};

export const TapZone = () => {
  const tapYield = useGameStore((s) => s.tapYield);
  const [labels, setLabels] = useState<FloatingLabelType[]>([]);
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    fetch("/sounds/drop_money.mp3")
      .then((res) => res.arrayBuffer())
      .then((arr) => ctx.decodeAudioData(arr))
      .then((buf) => {
        bufferRef.current = buf; // デコード済みバッファを保持
      });

    return () => {
      ctx.close();
    };
  }, []);

  const playSound = () => {
    const ctx = ctxRef.current;
    const buf = bufferRef.current;
    if (!ctx || !buf) return;

    // suspended の場合だけ resume（初回インタラクション後は不要）
    if (ctx.state === "suspended") ctx.resume();

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0); // 即再生
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    playSound();
    tap();
    const rect = e.currentTarget.getBoundingClientRect();
    setLabels((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        amount: Math.round(Number(tapYield ?? 1)),
      },
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
