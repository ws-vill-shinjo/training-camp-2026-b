export type QrPayload = {
  contentId: string;
};

/**
 * QR コードの生文字列をパースする。
 * 形式: `unlock:<contentId>`
 * 不正な形式の場合は null を返す。
 */
export function parseQrPayload(raw: string): QrPayload | null {
  const match = raw.match(/^unlock:(.+)$/);
  if (!match) return null;
  return { contentId: match[1] };
}
