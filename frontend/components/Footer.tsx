import { ArrowBigUpDash, BookSearch, House } from "lucide-react";
import { JSX } from "react";
import Link from "next/link";

export const Footer = (): JSX.Element => {
  return (
    <div className="fixed bottom-0 bg-[#B5D9A8] h-24 w-screen flex items-center justify-around text-[#484234]">
      <Link href="/upgrade" className="text-center flex flex-col items-center">
        <ArrowBigUpDash className="w-12 h-12" />
        <span>アップグレード</span>
      </Link>
      <Link href="/" className="text-center flex flex-col items-center">
        <House className="w-12 h-12" />
        <span>ホーム</span>
      </Link>
      <Link href="/encyclopedia" className="text-center flex flex-col items-center">
        <BookSearch className="w-12 h-12" />
        <span>ライブラリ</span>
      </Link>
    </div>
  );
};
