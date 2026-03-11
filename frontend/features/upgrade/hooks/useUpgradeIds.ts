import { useMemo } from "react";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import useGameStore from "@/features/game/store/useGameStore";

export function useUpgradeIds() {
  const registryReady = useGameStore((s) => s.registryReady);

  const { productionIds, bonusIds } = useMemo(() => {
    if (!registryReady) return { productionIds: [], bonusIds: [] };
    const registry = getMasterRegistry();
    return {
      productionIds: Object.keys(registry.production),
      bonusIds: Object.keys(registry.bonus),
    };
  }, [registryReady]);

  return { registryReady, productionIds, bonusIds };
}
