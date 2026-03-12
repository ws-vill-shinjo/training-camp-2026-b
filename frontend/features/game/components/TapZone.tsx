"use client";

import { AnimatePresence, motion } from "motion/react";
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

const CarrotSVG = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y}) scale(0.95)`}>
    <ellipse cx="0" cy="-38" rx="5" ry="14" fill="#4a9e3f" transform="rotate(-20)" />
    <ellipse cx="0" cy="-38" rx="5" ry="14" fill="#5db354" transform="rotate(10)" />
    <ellipse cx="0" cy="-38" rx="4" ry="12" fill="#6abe5f" transform="rotate(-5)" />
    <line x1="0" y1="-22" x2="0" y2="-8" stroke="#5a7a2e" strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="0" cy="4" rx="9" ry="12" fill="#f97316" />
    <ellipse cx="0" cy="-2" rx="9" ry="6" fill="#fb923c" />
    <path
      d="M -6 4 Q 0 6 6 4"
      stroke="#ea6a10"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M -7 9 Q 0 11 7 9"
      stroke="#ea6a10"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

const CARROT_POSITIONS = [
  { x: 60, y: 95 },
  { x: 130, y: 90 },
  { x: 200, y: 95 },
  { x: 95, y: 115 },
  { x: 165, y: 110 },
  { x: 235, y: 115 },
];

const FieldSVG = ({
  count,
  tapped,
  onAnimationComplete,
}: {
  count: number;
  tapped: boolean;
  onAnimationComplete?: () => void;
}) => (
  <motion.svg
    width="300"
    height="180"
    viewBox="0 0 300 180"
    animate={tapped ? { scale: [1, 0.92, 1.03, 1], y: [0, 8, -2, 0] } : {}}
    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
    onAnimationComplete={onAnimationComplete}
    style={{
      filter: tapped
        ? "brightness(0.85) drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
        : "brightness(1) drop-shadow(0 8px 20px rgba(0,0,0,0.4))",
    }}
  >
    <ellipse cx="150" cy="85" rx="148" ry="40" fill="#7c4f1e" />
    <rect x="4" y="85" width="292" height="70" fill="#8B5E2A" rx="4" />
    <ellipse cx="150" cy="155" rx="148" ry="18" fill="#7c4f1e" />
    {[40, 80, 130, 180, 230, 260, 60, 160, 210].map((dx, i) => (
      <circle key={i} cx={dx} cy={100 + (i % 3) * 18} r="3" fill="#6b4518" opacity="0.6" />
    ))}
    {CARROT_POSITIONS.slice(0, count).map((p, i) => (
      <CarrotSVG key={i} x={p.x} y={p.y} />
    ))}
  </motion.svg>
);

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
