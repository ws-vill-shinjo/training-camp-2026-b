import { Card } from "@/components/ui/card";
import type { EncyclopediaEntry } from "../types/encyclopedia";

type Props = {
  entry: EncyclopediaEntry;
  onSelect?: (entry: EncyclopediaEntry) => void;
};

export const EncyclopediaGridItem = ({ entry, onSelect }: Props) => {
  const { unlocked, title } = entry;

  return (
    <Card
      role="button"
      tabIndex={unlocked ? 0 : -1}
      aria-disabled={!unlocked}
      onClick={() => unlocked && onSelect?.(entry)}
      onKeyDown={(e) => e.key === "Enter" && unlocked && onSelect?.(entry)}
      className={`
        aspect-square w-full flex flex-col items-center justify-between
        p-1.5 rounded-2xl select-none
        ${unlocked ? "cursor-pointer hover:brightness-95 active:scale-95 transition-transform" : "pointer-events-none grayscale opacity-50"}
      `}
    >
      {/* アイコン領域：残りスペースを占有 */}
      <div className="flex-1 w-full flex items-center justify-center text-2xl">🌿</div>

      {/* ラベル：常に表示 */}
      <span className="shrink-0 w-full text-center text-xs leading-tight line-clamp-2">
        {title}
      </span>
    </Card>
  );
};
