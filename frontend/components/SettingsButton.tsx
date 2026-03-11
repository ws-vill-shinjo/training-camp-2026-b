"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const SettingsButton = () => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteSave = () => {
    // game-store への書き込みをブロックしてからストレージを削除
    const originalSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = (key: string, value: string) => {
      if (key === "game-store") return;
      originalSetItem(key, value);
    };
    localStorage.removeItem("game-store");
    window.location.reload();
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="設定">
        <Settings className="w-6 h-6 text-white" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>設定</DialogTitle>
          <DialogDescription>ゲームの設定を変更できます。</DialogDescription>
          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="destructive"
              onClick={() => {
                setOpen(false);
                setConfirmOpen(true);
              }}
            >
              セーブデータを削除
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogTitle>確認</DialogTitle>
          <DialogDescription>
            セーブデータを削除すると、すべての進行状況が失われます。本当に削除しますか？
          </DialogDescription>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              いいえ
            </Button>
            <Button variant="destructive" onClick={handleDeleteSave}>
              はい
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
