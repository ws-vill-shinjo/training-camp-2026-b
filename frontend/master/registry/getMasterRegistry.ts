import { loadMasters, type CsvFetcher } from "../loader/loadMasters";
import { buildMasterRegistry, type MasterRegistry } from "./buildMasterRegistry";
import useGameStore from "../../features/game/store/useGameStore";

let registry: MasterRegistry | null = null;

/**
 * アプリ起動時に1度だけ呼ぶ。
 * 2重呼び出しは無視される（冪等）。
 */
export const initializeMasterRegistry = async (fetcher?: CsvFetcher): Promise<void> => {
  if (registry !== null) return;
  const validated = await loadMasters(fetcher);
  registry = buildMasterRegistry(validated);
  useGameStore.setState({ registryReady: true });
};

/**
 * ドメイン層から参照する唯一の窓口。
 * initializeMasterRegistry() 前に呼ぶとエラー。
 */
export const getMasterRegistry = (): MasterRegistry => {
  if (registry === null) {
    throw new Error(
      "MasterRegistry が未初期化です。initializeMasterRegistry() を先に呼んでください。"
    );
  }
  return registry;
};

/**
 * テスト用: registryをリセットする。
 * プロダクションコードからは呼ばない。
 */
export const resetMasterRegistry = (): void => {
  registry = null;
};
