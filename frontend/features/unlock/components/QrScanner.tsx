"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import QrScannerLib from "qr-scanner";
import { parseQrPayload } from "../domain/parser";
import { processQrUnlock } from "../domain/unlock";
import type { UnlockResult } from "../types/qr";
import { emitQrUnlockResult } from "../../game/domain/event";

type Props = {
  onSuccess?: (result: UnlockResult & { success: true }) => void;
  onError?: (message: string) => void;
};

export const QrScanner = ({ onSuccess, onError }: Props) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScannerLib(
      videoRef.current,
      (result) => {
        const raw = result.data.replace(/^https?:\/\//, "");

        const payload = parseQrPayload(raw);
        if (!payload) {
          onError?.(`無効なQRコードです: ${raw}`);
          return;
        }

        const unlockResult = processQrUnlock(payload.contentId);
        emitQrUnlockResult(unlockResult);

        if (unlockResult.success) {
          onSuccess?.(unlockResult);
        } else {
          onError?.(`アンロックに失敗しました: ${unlockResult.reason}`);
        }
      },
      { returnDetailedScanResult: true, maxScansPerSecond: 1 }
    );

    scanner.start().catch(() => {
      router.push("/upgrade");
    });

    return () => {
      scanner.destroy();
    };
  }, [onSuccess, onError, router]);

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-2xl">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
};
