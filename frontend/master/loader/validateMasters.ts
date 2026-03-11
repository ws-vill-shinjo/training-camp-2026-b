import { z } from "zod";
import { ProductionMasterArraySchema, type ProductionMaster } from "../schema/productionSchema";
import { BonusMasterArraySchema, type BonusMaster } from "../schema/bonusSchema";
import { EventMasterArraySchema, type EventMaster } from "../schema/eventSchema";
import {
  EncyclopediaMasterArraySchema,
  type EncyclopediaMaster,
} from "../schema/encyclopediaSchema";
import { TapMasterArraySchema, type TapMaster } from "../schema/tapSchema";

export type RawMasters = {
  production: unknown;
  bonus: unknown;
  event: unknown;
  encyclopedia: unknown;
  tap: unknown;
};

export type ValidatedMasters = {
  production: ProductionMaster[];
  bonus: BonusMaster[];
  event: EventMaster[];
  encyclopedia: EncyclopediaMaster[];
  tap: TapMaster[];
};

export type ValidationResult =
  | { success: true; data: ValidatedMasters }
  | { success: false; errors: string[] };

export function validateMasters(raw: RawMasters): ValidationResult {
  const errors: string[] = [];

  const productionResult = ProductionMasterArraySchema.safeParse(raw.production);
  const bonusResult = BonusMasterArraySchema.safeParse(raw.bonus);
  const eventResult = EventMasterArraySchema.safeParse(raw.event);
  const encyclopediaResult = EncyclopediaMasterArraySchema.safeParse(raw.encyclopedia);
  const tapResult = TapMasterArraySchema.safeParse(raw.tap);

  if (!productionResult.success) {
    errors.push(...formatZodErrors("productionMaster", productionResult.error));
  }
  if (!bonusResult.success) {
    errors.push(...formatZodErrors("bonusMaster", bonusResult.error));
  }
  if (!eventResult.success) {
    errors.push(...formatZodErrors("eventMaster", eventResult.error));
  }
  if (!encyclopediaResult.success) {
    errors.push(...formatZodErrors("encyclopediaMaster", encyclopediaResult.error));
  }
  if (!tapResult.success) {
    errors.push(...formatZodErrors("tapMaster", tapResult.error));
  }

  if (errors.length > 0) return { success: false, errors };

  const production = productionResult.data!;
  const bonus = bonusResult.data!;
  const event = eventResult.data!;
  const encyclopedia = encyclopediaResult.data!;
  const tap = tapResult.data!;

  // 交差検証
  const productionIds = new Set(production.map((p) => p.id));
  const bonusIds = new Set(bonus.map((b) => b.id));
  const eventIds = new Set(event.map((e) => e.id));

  for (const b of bonus) {
    if (b.targetType === "production" && b.targetId && !productionIds.has(b.targetId)) {
      errors.push(
        `bonusMaster[${b.id}].targetId="${b.targetId}" は productionMaster に存在しません`
      );
    }
  }

  const encIds = new Set<string>();
  for (const enc of encyclopedia) {
    if (encIds.has(enc.id)) {
      errors.push(`encyclopediaMaster に重複idがあります: ${enc.id}`);
    }
    encIds.add(enc.id);

    const exists =
      (enc.sourceType === "production" && productionIds.has(enc.sourceId)) ||
      (enc.sourceType === "bonus" && bonusIds.has(enc.sourceId)) ||
      (enc.sourceType === "event" && eventIds.has(enc.sourceId));

    if (!exists) {
      errors.push(
        `encyclopediaMaster[${enc.id}].sourceId="${enc.sourceId}" は ${enc.sourceType}Master に存在しません`
      );
    }
  }

  if (errors.length > 0) return { success: false, errors };

  return { success: true, data: { production, bonus, event, encyclopedia, tap } };
}

function formatZodErrors(masterName: string, error: z.ZodError): string[] {
  const flat = error.flatten();
  const fieldErrors = Object.entries(flat.fieldErrors).map(
    ([field, msgs]) => `[${masterName}] ${field}: ${(msgs as string[] | undefined)?.join(", ")}`
  );
  const formErrors = flat.formErrors.map((msg) => `[${masterName}] ${msg}`);
  return [...fieldErrors, ...formErrors];
}
