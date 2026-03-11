"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductionItem } from "./ProductionItem";

type Props = {
  items: { id: string; level: number }[];
};

export const ProductionFacilities = ({ items }: Props) => {
  return (
    <Card className="mx-4">
      <CardHeader>
        <CardTitle>生産施設</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.map(({ id, level }) => (
          <ProductionItem key={id} id={id} level={level} />
        ))}
      </CardContent>
    </Card>
  );
};
