import { z } from "zod";
import {
  YieldTypeSchema,
  CostTypeSchema,
  ValueTypeSchema,
  TargetTypeSchema,
  SourceTypeSchema,
  EffectTypeSchema,
} from "../schema/common";
import { ProductionMasterSchema } from "../schema/productionSchema";
import { BonusMasterSchema } from "../schema/bonusSchema";
import { EventMasterSchema } from "../schema/eventSchema";
import { EncyclopediaMasterSchema } from "../schema/encyclopediaSchema";

export type YieldType = z.infer<typeof YieldTypeSchema>;
export type CostType = z.infer<typeof CostTypeSchema>;
export type ValueType = z.infer<typeof ValueTypeSchema>;
export type TargetType = z.infer<typeof TargetTypeSchema>;
export type SourceType = z.infer<typeof SourceTypeSchema>;
export type EffectType = z.infer<typeof EffectTypeSchema>;

export type MasterRegistry = {
  productions: z.infer<typeof ProductionMasterSchema>[];
  bonuses: z.infer<typeof BonusMasterSchema>[];
  events: z.infer<typeof EventMasterSchema>[];
  encyclopedias: z.infer<typeof EncyclopediaMasterSchema>[];
};
