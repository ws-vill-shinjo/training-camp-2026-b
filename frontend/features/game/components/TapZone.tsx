"use client";

import { AnimatePresence, motion } from "motion/react";
import { FloatingLabel } from "./FloatingLabel";
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { tap } from "@/features/game/domain/tap";
import useGameStore from "@/features/game/store/useGameStore";
import { FieldSVG } from "./DaikonSVG";

const HINT_TAP_THRESHOLD = 3;

type FloatingLabelType = {
  id: number;
  x: number;
  y: number;
  amount: number;
};

export const TapZone = memo(function TapZone() {
  const tapYield = useGameStore((s) => s.tapYield);
  const [labels, setLabels] = useState<FloatingLabelType[]>([]);
  const [tapped, setTapped] = useState(false);
  const [carrotCount, setCarrotCount] = useState(6);
  const [showHint, setShowHint] = useState(true);
  const hintTapCountRef = useRef(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  const handleLabelComplete = useCallback((id: number) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  }, []);

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
    setCarrotCount((prev) => (prev <= 1 ? 6 : prev - 1));

    if (showHint) {
      hintTapCountRef.current += 1;
      if (hintTapCountRef.current >= HINT_TAP_THRESHOLD) {
        setShowHint(false);
      }
    }

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
        {showHint && (
          <motion.div
            key="tap-hint"
            className="absolute inset-0 flex items-end justify-center pb-1 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <motion.span
              className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] select-none"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            >
              タップ！
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {labels.map((label) => (
          <FloatingLabel key={label.id} {...label} onComplete={handleLabelComplete} />
        ))}
      </AnimatePresence>
    </div>
  );
});
