"use client";
import { useState, useEffect } from "react";

const ITEMS = [
  { id: 1, name: "じゃがいも", emoji: "🥔", base: 1, cost: 10 },
  { id: 2, name: "じゃがいも²", emoji: "🥔", base: 5, cost: 50 },
  { id: 3, name: "じゃがいも³", emoji: "🥔", base: 20, cost: 200 },
  { id: 4, name: "じゃがいも⁴", emoji: "🥔", base: 100, cost: 1000 },
  { id: 5, name: "じゃがいも⁵", emoji: "🥔", base: 500, cost: 5000 },
];

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return Math.floor(n).toString();
}

export default function App() {
  const [points, setPoints] = useState(0);
  const [levels, setLevels] = useState(ITEMS.map(() => 0));
  const [taps, setTaps] = useState([]);

  const perSec = ITEMS.reduce((acc, item, i) => acc + item.base * levels[i], 0);

  useEffect(() => {
    const t = setInterval(() => setPoints((p) => p + perSec / 10), 100);
    return () => clearInterval(t);
  }, [perSec]);

  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setTaps((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setTaps((prev) => prev.filter((t) => t.id !== id)), 700);
    setPoints((p) => p + 1);
  };

  const upgrade = (i) => {
    const cost = Math.floor(ITEMS[i].cost * Math.pow(1.5, levels[i]));
    if (points >= cost) {
      setPoints((p) => p - cost);
      setLevels((lv) => lv.map((l, idx) => (idx === i ? l + 1 : l)));
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center py-4 gap-3 mt-3"
      style={{ background: "#EBD4B4" }}
    >
      {/* Item cards */}
      <div className="w-80 flex flex-col gap-2">
        {ITEMS.map((item, i) => {
          const cost = Math.floor(item.cost * Math.pow(1.5, levels[i]));
          const canAfford = points >= cost;
          const progress = ((levels[i] % 10) / 10) * 100;

          return (
            <div
              key={item.id}
              onClick={() => upgrade(i)}
              className={`rounded-xl px-3 py-2 shadow transition-transform ${canAfford ? "cursor-pointer active:scale-95" : "opacity-70 cursor-default"}`}
              style={{ background: "#E8A87C" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-base">{item.name}</span>
                    <span className="text-white text-xs">Lv.{levels[i]}</span>
                  </div>
                  <p className="text-white text-xs mb-1">
                    +{formatNum(item.base * (levels[i] + 1))}/秒　コスト: {formatNum(cost)}🥔
                  </p>
                  {/* Status bar */}
                  <div
                    className="rounded-full h-1.5 w-full"
                    style={{ background: "rgba(0,0,0,0.2)" }}
                  >
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%`, background: "#6AAED6" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tap / points area */}
      <div
        onClick={handleTap}
        className="relative overflow-hidden rounded-2xl w-80 px-4 py-5 text-center cursor-pointer select-none shadow-md active:scale-95 transition-transform"
        style={{ background: "#E8A87C" }}
      >
        <p className="text-white text-sm mb-1">じゃがいも</p>
        <p className="text-white text-4xl font-bold">🥔 {formatNum(points)}</p>
        <p className="text-white text-xs mt-2">毎秒 +{formatNum(perSec)} / タップで +1</p>
        {taps.map((t) => (
          <span
            key={t.id}
            className="pointer-events-none absolute text-white font-bold text-xl animate-bounce"
            style={{ left: t.x, top: t.y, transform: "translate(-50%,-50%)" }}
          >
            +1
          </span>
        ))}
      </div>
    </div>
  );
}
