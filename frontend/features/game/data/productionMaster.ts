export type ProductionMaster = {
  id: string;
  name: string;
  qrUnlockEnabled: boolean;
};

// TODO: 正式なものに変更する
export const productionMaster: ProductionMaster[] = [
  { id: "production-1", name: "生産ライン1", qrUnlockEnabled: true },
  { id: "production-2", name: "生産ライン2", qrUnlockEnabled: true },
  { id: "production-3", name: "生産ライン3", qrUnlockEnabled: false },
];
