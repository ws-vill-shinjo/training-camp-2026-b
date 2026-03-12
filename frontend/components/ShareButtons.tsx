"use client";

import { useState } from "react";

type ShareButtonsProps = {
  /** シェアする URL（省略時は現在のページの URL）*/
  url?: string;
  /** シェア時に添えるテキスト */
  text?: string;
};

/**
 * SNS シェアボタンコンポーネント。
 * X（旧 Twitter）・LINE・リンクコピーの3種類を提供します。
 *
 * @example
 * <ShareButtons url="https://example.com" text="見てみて！" />
 */
export function ShareButtons({ url, text = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // url が省略された場合は現在のページの URL を使う
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

  // X（旧 Twitter）でシェア
  const shareToX = () => {
    const params = new URLSearchParams({ text, url: shareUrl });
    window.open(`https://x.com/intent/tweet?${params}`, "_blank", "noopener,noreferrer");
  };

  // LINE でシェア
  const shareToLine = () => {
    const params = new URLSearchParams({ url: shareUrl, text });
    window.open(
      `https://social-plugins.line.me/lineit/share?${params}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // リンクをクリップボードにコピー
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      // 2秒後に「コピー済み」表示をリセット
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API が使えない環境用のフォールバック
      window.prompt("以下の URL をコピーしてください", shareUrl);
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center py-2">
      {/* X（旧 Twitter）シェアボタン */}
      <button
        type="button"
        onClick={shareToX}
        aria-label="X（旧 Twitter）でシェア"
        className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform border-none bg-transparent"
      >
        <span className="flex items-center justify-center bg-black rounded-full w-12 h-12 shadow-sm text-white">
          <XIcon />
        </span>
        <span className="text-xs text-muted-foreground">ポスト</span>
      </button>

      {/* LINE シェアボタン */}
      <button
        type="button"
        onClick={shareToLine}
        aria-label="LINE でシェア"
        className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform border-none bg-transparent"
      >
        <span className="flex items-center justify-center bg-[#06c755] rounded-full w-12 h-12 shadow-sm text-white">
          <LineIcon />
        </span>
        <span className="text-xs text-muted-foreground">LINE</span>
      </button>

      {/* リンクコピーボタン */}
      <button
        type="button"
        onClick={copyLink}
        aria-label="リンクをコピー"
        className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform border-none bg-transparent"
      >
        <span
          className={`flex items-center justify-center rounded-full w-12 h-12 shadow-sm text-white ${copied ? "bg-gray-400" : "bg-[#b5d9a8]"}`}
        >
          <LinkIcon />
        </span>
        <span className="text-xs text-muted-foreground">{copied ? "コピー済み" : "コピー"}</span>
      </button>
    </div>
  );
}

// --- アイコンコンポーネント（SVG）---

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.630 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.630 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.630v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.629 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
