import { useMemo } from "react";
import type { EncyclopediaMaster } from "../../../master/schema/encyclopediaSchema";
import { getMasterRegistry } from "../../../master/registry/getMasterRegistry";
import useGameStore from "../../game/store/useGameStore";

export type EncyclopediaEntry = EncyclopediaMaster & { unlocked: boolean };

/** sourceType / sourceId に基づいて解放済みかどうかを判定してエントリを返す */
export const useEncyclopediaEntries = (): EncyclopediaEntry[] => {
  const productionLevels = useGameStore((s) => s.productionLevels);
  const bonusLevels = useGameStore((s) => s.bonusLevels);
  const seenEvents = useGameStore((s) => s.seenEvents);

  return useMemo(() => {
    let encyclopediaMap: Record<string, EncyclopediaMaster> = {};
    try {
      encyclopediaMap = getMasterRegistry().encyclopedia;
    } catch {
      return [];
    }

    return Object.values(encyclopediaMap).map((entry) => {
      let unlocked = false;
      if (entry.sourceType === "production") {
        unlocked = (productionLevels[entry.sourceId] ?? 0) >= 1;
      } else if (entry.sourceType === "bonus") {
        unlocked = (bonusLevels[entry.sourceId] ?? 0) >= 1;
      } else if (entry.sourceType === "event") {
        unlocked = seenEvents[entry.sourceId] === true;
      }
      return { ...entry, unlocked };
    });
  }, [productionLevels, bonusLevels, seenEvents]);
};
