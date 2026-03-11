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
      tabIndex={unlocked ? 0 : -1}
      aria-disabled={!unlocked}
      onClick={() => unlocked && onSelect?.(entry)}
      onKeyDown={(e) => e.key === "Enter" && unlocked && onSelect?.(entry)}
      className={`
        flex flex-col gap-1 select-none
        ${unlocked ? "cursor-pointer" : "pointer-events-none grayscale opacity-50"}
      `}
    >
      <Card
        className={`
          relative aspect-square w-full overflow-hidden rounded-2xl
          ${unlocked ? "hover:brightness-95 active:scale-95 transition-transform" : ""}
        `}
      >
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </Card>

      <span className="w-full text-center text-[10px] leading-tight line-clamp-2">{title}</span>
    </div>
  );
};
