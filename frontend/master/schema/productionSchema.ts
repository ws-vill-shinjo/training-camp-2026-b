import { z } from "zod";
import { YieldTypeSchema, CostTypeSchema, NumberTableSchema } from "./common";

export const ProductionMasterSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    maxLevel: z.number().int().min(1),
    yieldType: YieldTypeSchema,
    baseYield: z.number().positive().optional(),
    yieldGrowth: z.number().min(0).optional(),
    yieldTable: NumberTableSchema.default([]),
    baseCycleMs: z.number().positive(),
    cycleReduceRate: z.number().positive().max(1),
    costType: CostTypeSchema,
    baseCost: z.number().min(0),
    costGrowth: z.number().min(1),
    costTable: NumberTableSchema.default([]),
    qrUnlockEnabled: z.boolean(),
    encyclopediaId: z.string().min(1),
    imageSrc: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.yieldType !== "table" && data.baseYield === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `yieldType が "table" 以外のとき baseYield は必須です (id: ${data.id})`,
        path: ["baseYield"],
      });
    }
    if (data.yieldType !== "table" && data.yieldGrowth === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `yieldType が "table" 以外のとき yieldGrowth は必須です (id: ${data.id})`,
        path: ["yieldGrowth"],
      });
    }
    if (data.yieldType === "table" && data.yieldTable.length < data.maxLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `yieldTable は ${data.maxLevel} 個以上の要素が必要です (id: ${data.id})`,
        path: ["yieldTable"],
      });
    }
    if (data.costType === "table" && data.costTable.length < data.maxLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `costTable は ${data.maxLevel} 個以上の要素が必要です (id: ${data.id})`,
        path: ["costTable"],
      });
    }
  });

export type ProductionMaster = z.infer<typeof ProductionMasterSchema>;
export const ProductionMasterArraySchema = z.array(ProductionMasterSchema);
