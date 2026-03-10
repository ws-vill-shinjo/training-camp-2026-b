"use client";
import { JSX } from "react";
import Image from "next/image";
export const Footer = (): JSX.Element => {
  return (
    <div className="fixed bottom-0 bg-[#E8A87C] h-30 w-screen flex items-center z--1 justify-around">
      <Image src="/flower.jpg" alt="アイコン" className="rounded-full" width={80} height={80} />
      <Image src="/flower.jpg" alt="アイコン" className="rounded-full" width={80} height={80} />
      <Image src="/flower.jpg" alt="アイコン" className="rounded-full" width={80} height={80} />
    </div>
  );
};
