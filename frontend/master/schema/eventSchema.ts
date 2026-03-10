import { z } from "zod";
import { EffectTypeSchema, TargetTypeSchema } from "./common";

export const EventMasterSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    spawnWeight: z.number().int().min(1),
    effectType: EffectTypeSchema,
    targetType: TargetTypeSchema,
    targetId: z.string().optional(),
    value: z.number(),
    durationMs: z.number().positive().optional(),
    flavorText: z.string().min(1),
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
  });

export type EventMaster = z.infer<typeof EventMasterSchema>;
export const EventMasterArraySchema = z.array(EventMasterSchema);
