import { z } from "zod";
import { YieldTypeSchema, CostTypeSchema, NumberTableSchema } from "./common";

export const TapMasterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  maxLevel: z.number().int().min(1),
  yieldType: YieldTypeSchema,
  baseYield: z.number(),
  yieldGrowth: z.number().min(0),
  yieldTable: NumberTableSchema.default([]),
  costType: CostTypeSchema,
  baseCost: z.number().min(0),
  costGrowth: z.number().min(1),
  costTable: NumberTableSchema.default([]),
  imageSrc: z.string().min(1),
});

export type TapMaster = z.infer<typeof TapMasterSchema>;
export const TapMasterArraySchema = z.array(TapMasterSchema);
