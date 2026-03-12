import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Yuji_Syuku } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { GameProvider } from "@/features/game/components/GameProvider";
import { Header } from "@/components/Header";
import Image from "next/image";
import { SettingsButton } from "@/components/SettingsButton";
import { NavigationLoadingProvider } from "@/components/NavigationLoadingProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const yujiSyuku = Yuji_Syuku({
  variable: "--font-yuji-syuku",
  weight: "400",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "新庄村ファーマー",
  description: "新庄村ファーマー",
  icons: {
    icon: "/title.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} ${yujiSyuku.variable}`}>
      <body className="bg-[#F0F9EC]">
        <Header>
          <div className="relative w-full flex items-center justify-center">
            <Image
              src="/title.png"
              alt="ホーム"
              height={40}
              width={260}
              className="object-contain"
            />
            <div className="absolute right-8 flex items-center h-full">
              <SettingsButton />
            </div>
          </div>
        </Header>
        <NavigationLoadingProvider>
          <div className="mb-24 overflow-x-hidden">
            <GameProvider>{children}</GameProvider>
          </div>
          <Footer />
        </NavigationLoadingProvider>
      </body>
    </html>
  );
}
