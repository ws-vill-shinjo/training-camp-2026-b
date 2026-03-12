"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronsUp } from "lucide-react";

type Props = { level: number };

export function LevelUpArrow({ level }: Props) {
  const prevLevelRef = useRef<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (prevLevelRef.current === null) {
      prevLevelRef.current = level;
      return;
    }
    if (level > prevLevelRef.current) {
      prevLevelRef.current = level;
      const t = setTimeout(() => setAnimKey((k) => k + 1), 0);
      return () => clearTimeout(t);
    }
    prevLevelRef.current = level;
  }, [level]);

  return (
    <div className="relative w-4 h-4 flex-shrink-0">
      <AnimatePresence>
        {animKey > 0 && (
          <motion.span
            key={animKey}
            initial={{ opacity: 1, y: 4 }}
            animate={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center text-green-500"
          >
            <ChevronsUp className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
