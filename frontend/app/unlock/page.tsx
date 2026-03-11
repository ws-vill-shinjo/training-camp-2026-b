"use client";

import { QrScanner } from "@/features/unlock/components/QrScanner";

export default function UnlockPage() {
  return (
    <div className="min-h-[calc(100svh-2rem)] flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <p className="text-sm text-muted-foreground text-center">
          カメラでQRコードを読み取ってください
        </p>
        <QrScanner />
      </div>
    </div>
  );
}
