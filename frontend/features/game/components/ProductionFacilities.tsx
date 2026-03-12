"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductionItem } from "./ProductionItem";

type Props = {
  items: { id: string; level: number }[];
};

export const ProductionFacilities = ({ items }: Props) => {
  return (
    <Card className="mx-4 h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <p className="text-base font-bold text-black">生産一覧</p>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center py-8">
              <p className="text-sm text-gray-400">生産施設がありません</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 px-4 pb-4">
              {items.map(({ id, level }) => <ProductionItem key={id} id={id} level={level} />)}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
