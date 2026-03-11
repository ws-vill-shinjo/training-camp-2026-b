"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export const TapZone = () => {
  return (
    <Card className="flex justify-center items-center pt-5 bg-transparent border-none shadow-none ring-0">
      <Image
        src="/images/TapCarrotField.png"
        alt="potato"
        width={320}
        height={320}
        className="mt-5"
      />
    </Card>
  );
};
