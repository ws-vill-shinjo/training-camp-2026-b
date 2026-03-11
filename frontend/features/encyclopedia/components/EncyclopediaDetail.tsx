import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EncyclopediaEntry } from "../hooks/useEncyclopediaEntries";
import { SECTION_LABEL } from "../types/encyclopedia";

type Props = {
  entry: EncyclopediaEntry;
};

export const EncyclopediaDetail = ({ entry }: Props) => {
  const { unlocked, title, shortText, detailText, sourceType } = entry;

  return (
    <Card className={`h-full ${!unlocked ? "opacity-50 grayscale" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{unlocked ? title : "???"}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {SECTION_LABEL[sourceType] ?? sourceType}
          </Badge>
        </div>
        <CardDescription>{unlocked ? shortText : "解放すると閲覧できます"}</CardDescription>
      </CardHeader>

      {unlocked && (
        <CardContent>
          <p className="text-sm text-foreground/80">{detailText}</p>
        </CardContent>
      )}

      {!unlocked && <CardFooter className="text-muted-foreground text-xs">🔒 未解放</CardFooter>}
    </Card>
  );
};
