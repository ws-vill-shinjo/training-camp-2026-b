/**
 * CSV由来の文字列フィールドをスキーマが期待する型へ変換する。
 *
 * 変換ルール:
 *   ""          → undefined  （省略可フィールド: targetId, durationMs, yieldTable 等）
 *   "true"      → true
 *   "false"     → false
 *   "1;2;3"     → [1, 2, 3]  （";区切り数値列"）
 *   "3000"      → 3000        （純粋な数値）
 *   それ以外    → string のまま
 */
export function coerceMasterRow(row: Record<string, string>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => {
      if (v === "") return [k, undefined];
      if (v === "true") return [k, true];
      if (v === "false") return [k, false];
      if (/^[\d.;]+$/.test(v) && v.includes(";")) {
        return [k, v.split(";").map(Number)];
      }
      if (/^-?[\d.]+$/.test(v)) return [k, Number(v)];
      return [k, v];
    })
  );
}
