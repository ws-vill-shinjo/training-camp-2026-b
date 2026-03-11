"use client";

import { ArrowBigUpDash, BookSearch, House } from "lucide-react";
import { JSX } from "react";
import { useRouter } from "next/navigation";

export const Footer = (): JSX.Element => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 bg-[#E8A87C] h-20 w-screen flex items-center justify-around">
      <ArrowBigUpDash
        className="w-12 h-12 cursor-pointer"
        onClick={() => router.push("/upgrade")}
      />
      <House className="w-12 h-12 cursor-pointer" onClick={() => router.push("/")} />
      <BookSearch
        className="w-12 h-12 cursor-pointer"
        onClick={() => router.push("/encyclopedia")}
      />
    </div>
  );
};
