export type BonusMaster = {
  id: string;
  name: string;
  qrUnlockEnabled: boolean;
};

export const bonusMaster: BonusMaster[] = [
  { id: "Sakuraya", name: "咲蔵家", qrUnlockEnabled: true },
  { id: "Michinoekigaisensakurashinjosyuku", name: "道の駅がいせんさくら新庄宿", qrUnlockEnabled: true },
  { id: "Wakihonjinkishirotei", name: "脇本陣木代邸", qrUnlockEnabled: true },
  { id: "Miyukibashi", name: "御幸橋", qrUnlockEnabled: true },
];
