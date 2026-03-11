"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductionItem } from "./ProductionItem";

type Props = {
  ids: string[];
};

export const ProductionFacilities = ({ ids }: Props) => {
  return (
    <Card className="mx-4">
      <CardHeader>
        <CardTitle>生産施設</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {ids.map((id) => (
          <ProductionItem key={id} id={id} />
        ))}
      </CardContent>
    </Card>
  );
};
