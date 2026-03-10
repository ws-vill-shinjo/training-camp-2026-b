import { z } from "zod";
import { SourceTypeSchema } from "./common";

export const EncyclopediaMasterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  shortText: z.string().min(1),
  detailText: z.string().min(1),
  sourceType: SourceTypeSchema,
  sourceId: z.string().min(1),
  imageSrc: z.string().min(1),
});

export type EncyclopediaMaster = z.infer<typeof EncyclopediaMasterSchema>;
export const EncyclopediaMasterArraySchema = z.array(EncyclopediaMasterSchema);
