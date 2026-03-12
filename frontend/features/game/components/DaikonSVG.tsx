"use client";

import { motion } from "motion/react";

type GroupProps = { x: number; y: number };

export const DaikonSVGGroup = ({ x, y }: GroupProps) => (
  <g transform={`translate(${x}, ${y}) scale(0.95)`}>
    {/* 葉 */}
    <ellipse cx="0" cy="-42" rx="6" ry="17" fill="#4a9e3f" transform="rotate(-28)" />
    <ellipse cx="0" cy="-42" rx="6" ry="17" fill="#5db354" transform="rotate(18)" />
    <ellipse cx="0" cy="-42" rx="5" ry="14" fill="#6abe5f" transform="rotate(-8)" />
    {/* 茎 */}
    <line x1="0" y1="-26" x2="0" y2="-10" stroke="#5a7a2e" strokeWidth="2" strokeLinecap="round" />
    {/* 胴体（上が丸く・下が平ら） */}
    <path d="M -8,0 A 8,9 0 0,1 8,0 L 8,7 L -8,7 Z" fill="#f0ede8" />
    {/* ハイライト */}
    <path d="M -3,1 A 3,7 0 0,1 3,1 L 3,6 L -3,6 Z" fill="#fafaf8" opacity="0.75" />
    {/* 横線テクスチャ */}
    <path d="M -7 3 Q 0 4 7 3" stroke="#ccc9c0" strokeWidth="1" fill="none" strokeLinecap="round" />
  </g>
);

type DaikonSVGProps = { size?: number; className?: string };

export const DaikonSVG = ({ size = 48, className }: DaikonSVGProps) => (
  <svg
    width={size}
    height={size}
    viewBox="-12 -62 24 72"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <DaikonSVGGroup x={0} y={0} />
  </svg>
);

const DAIKON_POSITIONS = [
  { x: 60,  y: 95 },
  { x: 130, y: 90 },
  { x: 200, y: 95 },
  { x: 95,  y: 115 },
  { x: 165, y: 110 },
  { x: 235, y: 115 },
];

type FieldSVGProps = {
  count: number;
  tapped: boolean;
  onAnimationComplete?: () => void;
};

export const FieldSVG = ({ count, tapped, onAnimationComplete }: FieldSVGProps) => (
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
    {/* 土 */}
    <ellipse cx="150" cy="85" rx="148" ry="40" fill="#7c4f1e" />
    <rect x="4" y="85" width="292" height="70" fill="#8B5E2A" rx="4" />
    <ellipse cx="150" cy="155" rx="148" ry="18" fill="#7c4f1e" />
    {[40, 80, 130, 180, 230, 260, 60, 160, 210].map((dx, i) => (
      <circle key={i} cx={dx} cy={100 + (i % 3) * 18} r="3" fill="#6b4518" opacity="0.6" />
    ))}

    {/* 大根（土の上に配置） */}
    {DAIKON_POSITIONS.slice(0, count).map((p, i) => (
      <DaikonSVGGroup key={i} x={p.x} y={p.y} />
    ))}
  </motion.svg>
);
