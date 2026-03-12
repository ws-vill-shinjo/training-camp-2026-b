"use client";

import { ArrowBigUpDash, BookSearch, House } from "lucide-react";
import { JSX } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useNavigationLoading } from "@/components/NavigationLoadingProvider";

const NavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const { setLoading } = useNavigationLoading();

  return (
    <Link
      href={href}
      onClick={() => { if (!isActive) setLoading(true); }}
      className={`flex-1 flex items-center justify-center ${isActive ? "pointer-events-none" : ""}`}
    >
      <motion.div
        whileTap={isActive ? undefined : { scale: 0.8, backgroundColor: "#9fcb91" }}
        transition={{ scale: { duration: 0.1 }, backgroundColor: { duration: 0 } }}
        className={`flex flex-col items-center justify-center w-24 py-2 rounded-xl ${isActive ? "opacity-40" : ""}`}
      >
        {icon}
        <span className="text-xs">{label}</span>
      </motion.div>
    </Link>
  );
};

export const Footer = (): JSX.Element => {
  return (
    <div className="fixed bottom-0 bg-[#B5D9A8] h-24 w-screen flex text-[#484234]">
      <NavItem href="/upgrade" icon={<ArrowBigUpDash className="w-12 h-12" />} label="アップグレード" />
      <NavItem href="/" icon={<House className="w-12 h-12" />} label="ホーム" />
      <NavItem href="/encyclopedia" icon={<BookSearch className="w-12 h-12" />} label="ライブラリ" />
    </div>
  );
};
