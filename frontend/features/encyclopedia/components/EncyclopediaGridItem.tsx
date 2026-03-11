import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EncyclopediaEntry } from "../hooks/useEncyclopediaEntries";
import { SECTION_LABEL } from "../types/encyclopedia";

type Props = {
  entry: EncyclopediaEntry;
  onSelect?: (entry: EncyclopediaEntry) => void;
};

export const EncyclopediaGridItem = ({ entry, onSelect }: Props) => {
  const { unlocked, title, shortText, sourceType } = entry;

  return (
    <div className={`aspect-square ${!unlocked ? "pointer-events-none" : ""}`}>
      <Card
        onClick={() => onSelect?.(entry)}
        className={`h-full overflow-hidden transition-shadow ${unlocked ? "cursor-pointer hover:shadow-md" : "opacity-50 grayscale"}`}
      >
        <CardHeader className="h-full justify-between">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2">{unlocked ? title : "???"}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {SECTION_LABEL[sourceType] ?? sourceType}
            </Badge>
          </div>
          <CardDescription className="line-clamp-3">
            {unlocked ? shortText : "🔒 解放すると閲覧できます"}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
