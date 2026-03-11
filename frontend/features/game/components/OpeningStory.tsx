"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const STORAGE_KEY = "opening_story_shown";

interface Scene {
  id: number;
  image: string;
  title: string;
  text: string;
}

const scenes: Scene[] = [
  {
    id: 1,
    image: "/images/Sakuranamiki.jpg",
    title: "新庄村へようこそ",
    text: "岡山県北西部、静かな山あいに位置する村\nそれが「新庄村」です\n\nがいせん桜の美しいこの地に、あなたはやってきました",
  },
  {
    id: 2,
    image: "/images/Wakihonjinkishirotei.jpg",
    title: "村の魅力に魅せられて",
    text: "歴史ある建物と豊かな自然に心を打たれ\nあなたはこの村のことをもっと知りたくなってきました",
  },
  {
    id: 3,
    image: "/images/Sarunashi.jpg",
    title: "農業のはじまり",
    text: "村人たちに勧められ、農作物を育てることに\nサルナシ、やまぶき、ヒメノモチ...\n\n新庄村には自慢の特産品がたくさんあります",
  },
  {
    id: 4,
    image: "/images/Michinoekigaisensakurashinjosyuku.jpg",
    title: "村を巡る旅",
    text: "道の駅や地元の施設を実際に訪れてみましょう\n各所に設置されたQRコードを読み込むと\n特別なボーナスが手に入ります！",
  },
  {
    id: 5,
    image: "/images/Akimatsuri.jpg",
    title: "さあ、はじめよう！",
    text: "農作物を育てて特産品を作り\n村に訪れる人たちを笑顔にして、新庄村を盛り上げよう！",
  },
];

export function OpeningStory() {
  const [isVisible, setIsVisible] = useState(
    () => typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)
  );
  const [currentScene, setCurrentScene] = useState(0);

  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const scene = scenes[currentScene];
  const isLastScene = currentScene === scenes.length - 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="opening-story-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
        >
          <div className="relative w-full max-w-lg mx-4">
            <button
              onClick={handleClose}
              className="absolute -top-10 right-0 text-white/60 text-sm hover:text-white transition-colors"
            >
              スキップ →
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: "#1a2e1a" }}
              >
                {/* Image area */}
                <div className="relative h-56 w-full">
                  <Image
                    src={scene.image}
                    alt={scene.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to bottom, transparent 40%, #1a2e1a 100%)",
                    }}
                  />
                  {/* Scene counter */}
                  <div className="absolute top-3 left-3 bg-black/40 text-white/80 text-xs px-2 py-1 rounded-full">
                    {currentScene + 1} / {scenes.length}
                  </div>
                </div>

                {/* Text content */}
                <div className="px-6 pb-6 pt-2">
                  <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="text-xl font-bold mb-3"
                    style={{ color: "#c8e6a0" }}
                  >
                    {scene.title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                    className="text-sm leading-relaxed whitespace-pre-line min-h-[5rem]"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {scene.text}
                  </motion.p>

                  {/* Progress dots */}
                  <div className="flex justify-center items-center gap-2 mt-5 mb-4">
                    {scenes.map((_, idx) => (
                      <motion.div
                        key={idx}
                        animate={{
                          width: idx === currentScene ? 20 : 8,
                          opacity: idx === currentScene ? 1 : 0.35,
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-2 rounded-full"
                        style={{ background: "#c8e6a0" }}
                      />
                    ))}
                  </div>

                  {/* Next / Start button */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNext}
                    className="w-full py-3 font-bold rounded-xl text-white transition-colors"
                    style={{ background: "#4a8c2a" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#5a9c3a";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#4a8c2a";
                    }}
                  >
                    {isLastScene ? "🌾 はじめる！" : "次へ →"}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
