"use client";

import { ArrowBigUpDash, BookSearch, House } from "lucide-react";
import { JSX } from "react";
import { useRouter } from "next/navigation";

export const Footer = (): JSX.Element => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 bg-[#B5D9A8] h-24 w-screen flex items-center justify-around">
      <div className="text-center text-white" onClick={() => router.push("/upgrade")}>
        <ArrowBigUpDash className="w-12 h-12 cursor-pointer" />
        強化
      </div>
      <div className="text-center text-white" onClick={() => router.push("/")}>
        <House className="w-12 h-12 cursor-pointer" />
        ホーム
      </div>
      <div className="text-center text-white" onClick={() => router.push("/encyclopedia")}>
        <BookSearch className="w-12 h-12 cursor-pointer" />
        図鑑
      </div>
    </div>
  );
};
