import { EncyclopediaMaster } from "@/master/schema/encyclopediaSchema";
import type { SourceTypeSchema } from "../../../master/schema/common";
import type { z } from "zod";

export type EncyclopediaSourceType = z.infer<typeof SourceTypeSchema>;

export type EncyclopediaEntry = EncyclopediaMaster & { unlocked: boolean };

export const SECTION_ORDER = [
  "production",
  "bonus",
  "event",
] as const satisfies EncyclopediaSourceType[];

export const SECTION_LABEL: Record<EncyclopediaSourceType, string> = {
  production: "生産",
  bonus: "ボーナス",
  event: "イベント",
};
