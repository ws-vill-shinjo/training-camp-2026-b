"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { QrScanner } from "@/features/unlock/components/QrScanner";
import type { UnlockResult } from "@/features/unlock/types/qr";
import { getMasterRegistry } from "@/master/registry/getMasterRegistry";
import { AlertCircle } from "lucide-react";

export default function UnlockPage() {
  const router = useRouter();
  const [unlockResult, setUnlockResult] = useState<(UnlockResult & { success: true }) | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <>
      <div className="min-h-[calc(100svh-12rem)] flex flex-col items-center justify-center gap-6">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            カメラでQRコードを読み取ってください
          </p>
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <QrScanner
            onSuccess={(result) => {
              setErrorMessage(null);
              setUnlockResult(result);
            }}
            onError={(message) => {
              setErrorMessage(message);
            }}
          />
        </div>
      </div>
      <Dialog
        open={unlockResult !== null}
        onOpenChange={(open) => {
          if (!open) setUnlockResult(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>アンロック成功！</DialogTitle>
            <DialogDescription>
              {(() => {
                const bonus = unlockResult
                  ? (getMasterRegistry().bonus[unlockResult.contentId] ?? null)
                  : null;
                return bonus ? (
                  <span className="flex flex-col items-center gap-3 pt-2">
                    <Image
                      src={bonus.imageSrc}
                      alt={bonus.name}
                      width={240}
                      height={160}
                      className="rounded-xl object-cover w-full"
                    />
                    <span>「{bonus.name}」を解放しました！</span>
                  </span>
                ) : (
                  `「${unlockResult?.contentId}」を解放しました！`
                );
              })()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => router.push("/upgrade")} className="bg-[#B5D9A8] text-[#484234] hover:bg-[#9fcb91] w-full">OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
