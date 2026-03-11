import { z } from "zod";

export const YieldTypeSchema = z.enum(["growth", "fixed", "table"]);
export const CostTypeSchema = z.enum(["growth", "fixed", "table"]);
export const ValueTypeSchema = z.enum(["growth", "fixed", "table"]);
export const TargetTypeSchema = z.enum(["production", "allProduction", "tap", "global"]);
export const SourceTypeSchema = z.enum(["production", "bonus", "event"]);

export const EffectTypeSchema = z.enum(["yieldMultiplier", "cycleMultiplier"]);

export const NumberTableSchema = z.array(z.number().positive());
