"use client";
import { JSX } from "react";
import Image from "next/image";
export const Footer = (): JSX.Element => {
  return (
    <div className="fixed bottom-0 bg-[#E8A87C] h-30 w-screen flex items-center z--1 justify-around">
      <div className="rounded-full w=80 h=80">
        <Image src="/house.png" alt="アイコン" width={78} height={78} />
      </div>
      <div className="rounded-full w=80 h=80">
        <Image src="/arrow-up.png" alt="アイコン" width={78} height={78} />
      </div>
      <div className="rounded-full w=80 h=80">
        <Image src="/book-search.png" alt="アイコン" width={78} height={78} />
      </div>
    </div>
  );
};
