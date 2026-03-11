"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProductionItem } from "./ProductionItem";

type Props = {
  items: { id: string; level: number }[];
};

export const ProductionFacilities = ({ items }: Props) => {
  return (
    <Card className="mx-4">
      <CardHeader>
        <p className="text-base font-bold text-black">生産一覧</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.map(({ id, level }) => (
          <ProductionItem key={id} id={id} level={level} />
        ))}
      </CardContent>
    </Card>
  );
};
