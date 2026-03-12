"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls } from "motion/react";

type Props = {
  level: number;
  children: React.ReactNode;
};

export function LevelUpCard({ level, children }: Props) {
  const controls = useAnimationControls();
  const prevLevelRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevLevelRef.current === null) {
      prevLevelRef.current = level;
      return;
    }
    if (level > prevLevelRef.current) {
      prevLevelRef.current = level;
      const t = setTimeout(() => {
        controls.start({ scale: [1, 1.04, 1], transition: { duration: 0.35, ease: "easeOut" } });
      }, 150);
      return () => clearTimeout(t);
    }
    prevLevelRef.current = level;
  }, [level, controls]);

  return <motion.div animate={controls}>{children}</motion.div>;
}
