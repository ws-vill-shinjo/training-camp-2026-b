"use client";
import { JSX } from "react";
import { Footer_icon } from "./Footer_icon";
export const Footer = (): JSX.Element => {
  return (
    <div className="fixed bottom-0 bg-[#E8A87C] h-30 w-screen flex items-center z--1 justify-around">
      <Footer_icon image="/arrow-up.png" />
      <Footer_icon image="/house.png" />
      <Footer_icon image="/book-search.png" />
    </div>
  );
};
