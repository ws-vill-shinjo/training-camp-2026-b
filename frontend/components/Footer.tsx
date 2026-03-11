import { ArrowBigUpDash, BookSearch, House } from "lucide-react";
import { JSX } from "react";
import Link from "next/link";

export const Footer = (): JSX.Element => {
  return (
    <div className="fixed bottom-0 bg-[#B5D9A8] h-24 w-screen flex items-center justify-around">
      <Link href="/upgrade" className="text-center text-white flex flex-col items-center">
        <ArrowBigUpDash className="w-12 h-12 text-white" />
        <span className="text-white">素材強化</span>
      </Link>
      <Link href="/" className="text-center text-white flex flex-col items-center">
        <House className="w-12 h-12 text-white" />
        <span className="text-white">ホーム</span>
      </Link>
      <Link href="/encyclopedia" className="text-center text-white flex flex-col items-center">
        <BookSearch className="w-12 h-12 text-white" />
        <span className="text-white">図鑑</span>
      </Link>
    </div>
  );
};
