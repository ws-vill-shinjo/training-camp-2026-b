import type { EncyclopediaEntry } from "../types/encyclopedia";

export const mockEncyclopediaEntries: EncyclopediaEntry[] = [
  // --- 施設 (production) ---
  {
    id: "Himenomochi",
    title: "ヒメノモチ",
    shortText: "新庄村の代表的な名産品。新庄村が誇るブランド米。",
    detailText:
      "特徴：白さが際立ち、コシが強く、時間が経っても硬くなりにくいです。おいしい食べ方：お雑煮・焼き餅。伸びの良さと米の甘みをダイレクトに感じられます。",
    sourceType: "production",
    sourceId: "Himenomochi",
    imageSrc: "",
    unlocked: true,
  },
  {
    id: "Sarunashi",
    title: "サルナシ",
    shortText: "新庄村の代表的な特産物。幻のフルーツとも呼ばれる。",
    detailText:
      "特徴：「ベビーキウイ」とも呼ばれ、皮ごと食べられます。非常に栄養価が高いのも特徴です。",
    sourceType: "production",
    sourceId: "Sarunashi",
    imageSrc: "",
    unlocked: true,
  },
  {
    id: "ItalianTomato",
    title: "イタリアントマト",
    shortText: "新庄村の代表的な特産物。少し細長い唐辛子のような形をしている。",
    detailText: "特徴：加熱することで旨味（グアニル酸）が劇的に増す、調理用トマト。",
    sourceType: "production",
    sourceId: "ItalianTomato",
    imageSrc: "",
    unlocked: false,
  },
  {
    id: "Yamabuki",
    title: "やまぶき",
    shortText: "新庄村でとれる代表的な山菜。茎が細く、シュッとしている。",
    detailText: "特徴：野生種ならではの力強い香りと、心地よい苦味が特徴です。",
    sourceType: "production",
    sourceId: "Yamabuki",
    imageSrc: "",
    unlocked: false,
  },
  {
    id: "Wasabi",
    title: "わさび",
    shortText: "新庄村の清流で育つ本わさび。",
    detailText: "特徴：清澄な水で育てられ、辛みと甘みのバランスが絶妙です。",
    sourceType: "production",
    sourceId: "Wasabi",
    imageSrc: "",
    unlocked: false,
  },

  // --- ボーナス (bonus) ---
  {
    id: "YieldUp1",
    title: "収穫量アップ Lv.1",
    shortText: "全施設の収益が 10% 増加する。",
    detailText: "新庄村の農業技術向上により、各施設の収穫効率が上がりました。",
    sourceType: "bonus",
    sourceId: "YieldUp1",
    imageSrc: "",
    unlocked: true,
  },
  {
    id: "CycleDown1",
    title: "サイクル短縮 Lv.1",
    shortText: "全施設の生産サイクルが 10% 短縮される。",
    detailText: "作業工程の改善により、生産にかかる時間が短くなりました。",
    sourceType: "bonus",
    sourceId: "CycleDown1",
    imageSrc: "",
    unlocked: false,
  },
  {
    id: "TapBoost1",
    title: "タップ強化 Lv.1",
    shortText: "タップ 1 回あたりの収益が増加する。",
    detailText: "手作業のコツをつかんで、1 回あたりの生産量が増えました。",
    sourceType: "bonus",
    sourceId: "TapBoost1",
    imageSrc: "",
    unlocked: false,
  },

  // --- イベント (event) ---
  {
    id: "HarvestFestival",
    title: "収穫祭",
    shortText: "期間中、全施設の収益が 2 倍になる。",
    detailText: "新庄村恒例の収穫祭が開催されました！村中が活気に満ち、生産量が大幅に増加します。",
    sourceType: "event",
    sourceId: "HarvestFestival",
    imageSrc: "",
    unlocked: true,
  },
  {
    id: "StormWarning",
    title: "嵐の予報",
    shortText: "期間中、全施設の収益が半減する。",
    detailText:
      "台風が接近中です。農作物への影響が心配されます。生産量が低下する可能性があります。",
    sourceType: "event",
    sourceId: "StormWarning",
    imageSrc: "",
    unlocked: false,
  },
];
