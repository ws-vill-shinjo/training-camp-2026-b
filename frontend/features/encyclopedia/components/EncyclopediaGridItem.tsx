import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { EncyclopediaEntry } from "../types/encyclopedia";

type Props = {
  entry: EncyclopediaEntry;
  onSelect?: (entry: EncyclopediaEntry) => void;
};

export const EncyclopediaGridItem = ({ entry, onSelect }: Props) => {
  const { unlocked, title, imageSrc } = entry;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(entry)}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.(entry)}
      className="flex flex-col gap-1 select-none min-w-0 cursor-pointer"
    >
      <Card
        className={`
          relative aspect-square w-full overflow-hidden rounded-2xl
          ${unlocked ? "hover:brightness-95 active:scale-95 transition-transform" : "grayscale opacity-60 hover:brightness-95 active:scale-95 transition-transform"}
        `}
      >
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </Card>

      <span className="w-full text-center text-[10px] leading-tight line-clamp-2">{title}</span>
    </div>
  );
};
