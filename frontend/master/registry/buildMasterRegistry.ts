import type { ProductionMaster } from "../schema/productionSchema";
import type { BonusMaster } from "../schema/bonusSchema";
import type { EventMaster } from "../schema/eventSchema";
import type { EncyclopediaMaster } from "../schema/encyclopediaSchema";
import type { ValidatedMasters } from "../loader/validateMasters";

export type MasterRegistry = {
  production: Record<string, ProductionMaster>;
  bonus: Record<string, BonusMaster>;
  event: Record<string, EventMaster>;
  encyclopedia: Record<string, EncyclopediaMaster>;
};

export function buildMasterRegistry(validated: ValidatedMasters): MasterRegistry {
  return {
    production: Object.fromEntries(validated.production.map((m) => [m.id, m])),
    bonus: Object.fromEntries(validated.bonus.map((m) => [m.id, m])),
    event: Object.fromEntries(validated.event.map((m) => [m.id, m])),
    encyclopedia: Object.fromEntries(validated.encyclopedia.map((m) => [m.id, m])),
  };
}
