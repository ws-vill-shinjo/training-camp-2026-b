import { useMemo } from "react";
import { getMasterRegistry } from "../../../master/registry/getMasterRegistry";
import useGameStore from "../../game/store/useGameStore";
import type { EncyclopediaEntry } from "../types/encyclopedia";

/** sourceType / sourceId に基づいて解放済みかどうかを判定してエントリを返す */
export const useEncyclopediaEntries = (): EncyclopediaEntry[] => {
  const registryReady = useGameStore((s) => s.registryReady);
  const productionLevels = useGameStore((s) => s.productionLevels);
  const bonusLevels = useGameStore((s) => s.bonusLevels);
  const seenEvents = useGameStore((s) => s.seenEvents);

  return useMemo(() => {
    if (!registryReady) return [];

    const encyclopediaMap = getMasterRegistry().encyclopedia;

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
  }, [registryReady, productionLevels, bonusLevels, seenEvents]);
};
