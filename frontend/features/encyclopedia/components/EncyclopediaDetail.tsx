import Image from "next/image";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { EncyclopediaEntry } from "../types/encyclopedia";
import { SECTION_LABEL } from "../types/encyclopedia";

type Props = {
  entry: EncyclopediaEntry | null;
  onClose: () => void;
};

export const EncyclopediaDetail = ({ entry, onClose }: Props) => (
  <Dialog
    open={entry !== null}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <DialogContent>
      <VisuallyHidden>
        <DialogTitle>{entry?.title ?? ""}</DialogTitle>
      </VisuallyHidden>
      {entry && (
        <div className="flex flex-col py-4 gap-4">
          <Card className="relative mx-4 aspect-square overflow-hidden">
            <Image src={entry.imageSrc} alt={entry.title} fill className="object-cover" />
          </Card>
          <div className="flex items-start justify-between gap-2 px-4">
            <CardTitle>{entry.title}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {SECTION_LABEL[entry.sourceType] ?? entry.sourceType}
            </Badge>
          </div>
          <CardDescription className="px-4">{entry.shortText}</CardDescription>
          <p className="px-4 text-sm text-foreground/80">
            {entry.unlocked ? entry.detailText : "???"}
          </p>
        </div>
      )}
    </DialogContent>
  </Dialog>
);
