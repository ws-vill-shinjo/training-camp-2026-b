// features/game/components/FloatingLabel.tsx
import { motion } from "motion/react";
import { CircleDollarSignIcon } from "lucide-react";

type Props = {
  id: number;
  x: number;
  y: number;
  amount: number;
  onComplete: (id: number) => void;
};

export const FloatingLabel = ({ id, x, y, amount, onComplete }: Props) => {
  return (
    <motion.span
      initial={{ opacity: 1, y: 0, x: "-50%" }}
      animate={{ opacity: 0, y: -60 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute pointer-events-none font-bold text-xl drop-shadow"
      style={{ left: x, top: y }}
    >
      <div className="flex items-center gap-1 text-yellow-400">
        <CircleDollarSignIcon size={20} />
        <span>+{amount}</span>
      </div>
    </motion.span>
  );
};
