"use client";

import { useEffect, useRef } from "react";
import QrScannerLib from "qr-scanner";
import { parseQrPayload } from "../domain/parser";
import { processQrUnlock, UnlockResult } from "../domain/unlock";
import { emitQrUnlockResult } from "../../game/domain/event";

// 使用側のコード
{
  /* <button className="btn btn-secondary mb-4" onClick={() => isCamera((prev) => !prev)}>
  {camera ? "QRスキャナーを閉じる" : "QRスキャナーを開く"}
</button>
{camera && (
  <div className="mb-4">
    <h2 className="h5">QRコードスキャナー</h2>
    <p>QRコードをスキャンしてコンテンツをアンロックできます。</p>
    <QrScanner
      onSuccess={(result) => {
        isCamera(false);
        setUnlockResult(result);
      }}
    />
  </div>
)}

<Dialog open={unlockResult !== null} onOpenChange={(open) => { if (!open) setUnlockResult(null); }}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {unlockResult?.alreadyUnlocked ? "すでにアンロック済み" : "アンロック成功！"}
      </DialogTitle>
      <DialogDescription>
        {unlockResult?.alreadyUnlocked
          ? `「${unlockResult.contentId}」はすでに解放されています。`
          : `「${unlockResult?.contentId}」を解放しました！`}
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog> */
}

type Props = {
  onSuccess?: (result: UnlockResult & { success: true }) => void;
};

export function QrScanner({ onSuccess }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScannerLib(
      videoRef.current,
      (result) => {
        const raw = result.data.replace(/^https?:\/\//, "");

        const payload = parseQrPayload(raw);
        if (!payload) {
          alert(`無効なQRコードです: ${raw}`);
          return;
        }

        const unlockResult = processQrUnlock(payload.contentId);
        console.log("Unlock result:", unlockResult);
        emitQrUnlockResult(unlockResult);

        if (unlockResult.success) {
          onSuccess?.(unlockResult);
        } else {
          alert(`アンロックに失敗しました: ${unlockResult.reason}`);
        }
      },
      { returnDetailedScanResult: true }
    );

    scanner.start();

    return () => {
      scanner.destroy();
    };
  }, [onSuccess]);

  return <video ref={videoRef} style={{ width: "100%", maxWidth: "400px" }} />;
}
