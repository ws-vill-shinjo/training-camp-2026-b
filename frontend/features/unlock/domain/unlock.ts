import { productionMaster } from "../../game/data/productionMaster";
import useGameStore from "../../game/store/useGameStore";

export type UnlockTarget = { type: "production"; id: string } | { type: "bonus"; id: string };

/** contentId に対応するアンロック対象を返す。qrUnlockEnabled=false または未存在なら null。 */
export function resolveUnlockTarget(contentId: string): UnlockTarget | null {
  const production = productionMaster.find((p) => p.id === contentId && p.qrUnlockEnabled);
  if (production) return { type: "production", id: production.id };

  return null;
}

/**
 * contentId がアンロック可能かどうかを判定する。
 * TODO: 必要に応じてレベル上限チェックや前提条件チェックを追加する
 */
export function canUnlockContent(contentId: string): boolean {
  return resolveUnlockTarget(contentId) !== null;
}

export type UnlockResult =
  | { success: true; contentId: string; alreadyUnlocked: boolean }
  | { success: false; reason: string };

/**
 * QR コードのアンロック処理を行う。
 * - 既解放コンテンツは冪等成功（副作用なし）
 */
export function processQrUnlock(contentId: string): UnlockResult {
  const target = resolveUnlockTarget(contentId);
  if (!target) {
    return { success: false, reason: `Unknown contentId: ${contentId}` };
  }

  const store = useGameStore.getState();

  if (target.type === "production") {
    // 「レベル 0 = 未解放」という前提。解放済み判定ロジックを変更する場合はここも修正する
    const currentLevel = store.productionLevels[target.id] ?? 0;
    if (currentLevel > 0) {
      return { success: true, contentId, alreadyUnlocked: true };
    }
    store.upgradeProductionLevel(target.id);
  } else {
    const currentLevel = store.bonusLevels[target.id] ?? 0;
    if (currentLevel > 0) {
      return { success: true, contentId, alreadyUnlocked: true };
    }
    store.upgradeBonusLevel(target.id);
  }

  return { success: true, contentId, alreadyUnlocked: false };
}
