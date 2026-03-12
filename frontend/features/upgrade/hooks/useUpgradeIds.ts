import { useMemo } from "react";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";

export function useUpgradeIds() {
  const { productionIds, bonusIds } = useMemo(() => {
    const registry = getMasterRegistry();
    return {
      productionIds: Object.keys(registry.production),
      bonusIds: Object.keys(registry.bonus),
    };
  }, []);

  return { productionIds, bonusIds };
}
