import { z } from "zod";
import {
  TargetTypeSchema,
  EffectTypeSchema,
  ValueTypeSchema,
  CostTypeSchema,
  NumberTableSchema,
} from "./common";

export const BonusMasterSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    maxLevel: z.number().int().min(1),
    targetType: TargetTypeSchema,
    targetId: z.string().optional(),
    effectType: EffectTypeSchema,
    valueType: ValueTypeSchema,
    baseValue: z.number(),
    valueGrowth: z.number().min(0),
    valueTable: NumberTableSchema.default([]),
    costType: CostTypeSchema,
    baseCost: z.number().min(0),
    costGrowth: z.number().min(1),
    costTable: NumberTableSchema.default([]),
    qrUnlockEnabled: z.boolean(),
    encyclopediaId: z.string().min(1),
    imageSrc: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.targetType === "production" && !data.targetId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `targetType が "production" のとき targetId は必須です (id: ${data.id})`,
        path: ["targetId"],
      });
    }
    if (data.valueType === "table" && data.valueTable.length < data.maxLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `valueTable は ${data.maxLevel} 個以上の要素が必要です (id: ${data.id})`,
        path: ["valueTable"],
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

export type BonusMaster = z.infer<typeof BonusMasterSchema>;
export const BonusMasterArraySchema = z.array(BonusMasterSchema);
