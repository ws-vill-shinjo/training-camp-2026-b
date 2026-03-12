import { Button } from "./ui/button";
import { Card, CardTitle, CardDescription } from "./ui/card";
import { Dispatch, JSX, SetStateAction, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type CardProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  name: string;
  imageSrc: string;
  shortText: string;
};

export const UpgradeCard = ({
  open,
  setOpen,
  name,
  imageSrc,
  shortText,
}: CardProps): JSX.Element => {
  const [isVisiable, setIsVisible] = useState(true);
  if (!isVisiable) return <div></div>;
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>{name ?? ""}</DialogTitle>
        </VisuallyHidden>
        {name && (
          <div className="flex flex-col py-4 gap-4">
            <Card className="relative mx-4 aspect-square overflow-hidden">
              <Image src={imageSrc} alt={name} fill className="object-cover" />
            </Card>
            <p className="px-4 text-sm">アンロックしました！</p>
            <CardTitle className="px-4">{name}</CardTitle>
            <CardDescription className="px-4">{shortText}</CardDescription>
            <div className="px-4">
              <Button
                className="w-full bg-[#B5D9A8] text-[#484234] hover:bg-[#9fcb91] text-white"
                onClick={() => setIsVisible(false)}
              >
                OK
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
