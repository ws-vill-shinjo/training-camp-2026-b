import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { EncyclopediaEntry } from "../types/encyclopedia";
import { motion } from "motion/react";

type Props = {
  entry: EncyclopediaEntry;
  onSelect?: (entry: EncyclopediaEntry) => void;
};

export const EncyclopediaGridItem = ({ entry, onSelect }: Props) => {
  const { unlocked, title, imageSrc } = entry;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(entry)}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.(entry)}
      whileTap={{ scale: 0.88 }}
      transition={{ duration: 0.1 }}
      className="flex flex-col gap-1 select-none min-w-0 cursor-pointer"
    >
      <Card
        className={`relative aspect-square w-full overflow-hidden rounded-2xl ${!unlocked ? "grayscale opacity-60" : ""}`}
      >
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </Card>

      <span className="w-full text-center text-[10px] leading-tight line-clamp-2">{title}</span>
    </motion.div>
  );
};
