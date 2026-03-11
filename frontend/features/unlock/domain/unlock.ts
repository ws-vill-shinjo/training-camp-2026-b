import { getMasterRegistry } from "../../../master/registry/getMasterRegistry";
import useGameStore from "../../game/store/useGameStore";
import { UnlockResult, UnlockTarget } from "../types/qr";

/** contentId に対応するアンロック対象を返す。qrUnlockEnabled=false または未存在なら null。 */
export const resolveUnlockTarget = (contentId: string): UnlockTarget | null => {
  try {
    const registry = getMasterRegistry();

    const production = registry.production[contentId];
    if (production?.qrUnlockEnabled) return { type: "production", id: contentId };

    const bonus = registry.bonus[contentId];
    if (bonus?.qrUnlockEnabled) return { type: "bonus", id: contentId };
  } catch {
    // レジストリ未初期化
  }
  return null;
};

/**
 * contentId がアンロック可能かどうかを判定する。
 * TODO: 必要に応じてレベル上限チェックや前提条件チェックを追加する
 */
export const canUnlockContent = (contentId: string): boolean => {
  return resolveUnlockTarget(contentId) !== null;
};

/**
 * QR コードのアンロック処理を行う。
 * - 既解放コンテンツは冪等成功（副作用なし）
 */
export const processQrUnlock = (contentId: string): UnlockResult => {
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
};
