import { ArrowBigUpDash, BookSearch, House } from "lucide-react";
import { JSX } from "react";
import Link from "next/link";

export const Footer = (): JSX.Element => {
  return (
    <div className="fixed bottom-0 bg-[#B5D9A8] h-24 w-screen flex text-[#484234]">
      <div className="flex-1 flex items-center justify-center">
        <Link
          href="/upgrade"
          className="flex flex-col items-center justify-center w-24 py-2 rounded-xl active:bg-[#9fcb91] transition-colors"
        >
          <ArrowBigUpDash className="w-12 h-12" />
          <span className="text-xs">アップグレード</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Link
          href="/"
          className="flex flex-col items-center justify-center w-24 py-2 rounded-xl active:bg-[#9fcb91] transition-colors"
        >
          <House className="w-12 h-12" />
          <span className="text-xs">ホーム</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Link
          href="/encyclopedia"
          className="flex flex-col items-center justify-center w-24 py-2 rounded-xl active:bg-[#9fcb91] transition-colors"
        >
          <BookSearch className="w-12 h-12" />
          <span className="text-xs">ライブラリ</span>
        </Link>
      </div>
    </div>
  );
};
