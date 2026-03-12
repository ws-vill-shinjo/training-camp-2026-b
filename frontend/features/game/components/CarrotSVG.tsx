"use client";

import { motion } from "motion/react";

type GroupProps = { x: number; y: number };

export const CarrotSVGGroup = ({ x, y }: GroupProps) => (
  <g transform={`translate(${x}, ${y}) scale(0.95)`}>
    {/* 葉 */}
    <ellipse cx="0" cy="-42" rx="6" ry="17" fill="#4a9e3f" transform="rotate(-28)" />
    <ellipse cx="0" cy="-42" rx="6" ry="17" fill="#5db354" transform="rotate(18)" />
    <ellipse cx="0" cy="-42" rx="5" ry="14" fill="#6abe5f" transform="rotate(-8)" />
    {/* 茎 */}
    <line x1="0" y1="-26" x2="0" y2="-10" stroke="#5a7a2e" strokeWidth="2" strokeLinecap="round" />
    {/* 胴体（白） */}
    <ellipse cx="0" cy="8" rx="8" ry="22" fill="#f0ede8" />
    {/* ハイライト */}
    <ellipse cx="-2.5" cy="2" rx="2.5" ry="13" fill="#fafaf8" opacity="0.75" />
    {/* 横線テクスチャ */}
    <path d="M -7 0 Q 0 1 7 0" stroke="#ccc9c0" strokeWidth="1" fill="none" strokeLinecap="round" />
    <path
      d="M -8 9 Q 0 10 8 9"
      stroke="#ccc9c0"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M -7 18 Q 0 19 7 18"
      stroke="#ccc9c0"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />
    {/* 先端 */}
    <ellipse cx="0" cy="30" rx="2" ry="3.5" fill="#e0dcd4" />
  </g>
);

type CarrotSVGProps = { size?: number; className?: string };

export const CarrotSVG = ({ size = 48, className }: CarrotSVGProps) => (
  <svg
    width={size}
    height={size}
    viewBox="-15 -62 30 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <CarrotSVGGroup x={0} y={0} />
  </svg>
);

const CARROT_POSITIONS = [
  { x: 60, y: 95 },
  { x: 130, y: 90 },
  { x: 200, y: 95 },
  { x: 95, y: 115 },
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
    <ellipse cx="150" cy="85" rx="148" ry="40" fill="#7c4f1e" />
    <rect x="4" y="85" width="292" height="70" fill="#8B5E2A" rx="4" />
    <ellipse cx="150" cy="155" rx="148" ry="18" fill="#7c4f1e" />
    {[40, 80, 130, 180, 230, 260, 60, 160, 210].map((dx, i) => (
      <circle key={i} cx={dx} cy={100 + (i % 3) * 18} r="3" fill="#6b4518" opacity="0.6" />
    ))}
    {CARROT_POSITIONS.slice(0, count).map((p, i) => (
      <CarrotSVGGroup key={i} x={p.x} y={p.y} />
    ))}
  </motion.svg>
);
