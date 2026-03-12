import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
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
          <div className="flex justify-center items-center pt-5">
            <Card className=" bg-white rounded justify-center items-center flex gap-2 z-99">
              <Image src={imageSrc} width={400} height={400} alt={name} />
              <CardContent className="bg-green-100 h-40 w-full">
                <div className="text-black text-3xl">{name}</div>
                <p className="text-black text-xl mt-5">{shortText}</p>
              </CardContent>
              <CardFooter className="w-full">
                <Button className="w-full items-center" onClick={() => setIsVisible(false)}>
                  OK
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
