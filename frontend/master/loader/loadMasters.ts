import { parseCsv } from "./parseCsv";
import { coerceMasterRow } from "./coerceMasterRow";
import { validateMasters, type ValidatedMasters } from "./validateMasters";

export type CsvFetcher = (name: string) => Promise<string>;

async function fetchCsv(path: string): Promise<Record<string, string>[]> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`CSV の読み込みに失敗しました: ${path}`);
  return parseCsv(await res.text());
}

export async function loadMasters(fetcher?: CsvFetcher): Promise<ValidatedMasters> {
  const load = fetcher
    ? (path: string): Promise<Record<string, string>[]> =>
        fetcher(path).then((text) => parseCsv(text))
    : fetchCsv;

  const [productionRaw, bonusRaw, eventRaw, encyclopediaRaw, tapRaw] = await Promise.all([
    load("/master/data/productionMaster.csv"),
    load("/master/data/bonusMaster.csv"),
    load("/master/data/eventMaster.csv"),
    load("/master/data/encyclopediaMaster.csv"),
    load("/master/data/tapMaster.csv"),
  ]);

  const result = validateMasters({
    production: productionRaw.map(coerceMasterRow),
    bonus: bonusRaw.map(coerceMasterRow),
    event: eventRaw.map(coerceMasterRow),
    encyclopedia: encyclopediaRaw.map(coerceMasterRow),
    tap: tapRaw.map(coerceMasterRow),
  });

  if (!result.success) {
    console.error("マスターデータ検証エラー:", result.errors);
    throw new Error("マスターデータの読み込みに失敗しました。開発者にお問い合わせください。");
  }

  return result.data;
}
