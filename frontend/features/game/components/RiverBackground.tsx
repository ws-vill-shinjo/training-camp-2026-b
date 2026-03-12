"use client";

const BUBBLES = [
  { left: "4%",  delay: 0.0, duration: 5.0 },
  { left: "11%", delay: 2.4, duration: 4.3 },
  { left: "18%", delay: 0.8, duration: 5.6 },
  { left: "25%", delay: 3.1, duration: 4.8 },
  { left: "32%", delay: 1.5, duration: 5.2 },
  { left: "39%", delay: 0.3, duration: 4.6 },
  { left: "46%", delay: 2.7, duration: 5.9 },
  { left: "53%", delay: 1.2, duration: 4.1 },
  { left: "60%", delay: 3.5, duration: 5.4 },
  { left: "67%", delay: 0.6, duration: 4.9 },
  { left: "74%", delay: 2.0, duration: 5.7 },
  { left: "81%", delay: 1.8, duration: 4.4 },
  { left: "88%", delay: 3.3, duration: 5.1 },
  { left: "94%", delay: 0.9, duration: 6.0 },
];

export function RiverBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* ── 空グラデーション ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #3A9BD5 0%, #69C3E8 22%, #A8DFF0 42%, #C4EDBC 60%, #8DC87A 78%, #5DA83A 100%)",
        }}
      />

      {/* ── 中景の丘（奥） ── */}
      <svg
        className="absolute left-0 w-full"
        style={{ bottom: "34%", height: "190px" }}
        viewBox="0 0 800 190"
        preserveAspectRatio="none"
      >
        <path
          d="M0,130 C90,40 200,170 350,75 C500,0 650,130 800,55 L800,190 L0,190 Z"
          fill="#4E9030"
        />
      </svg>

      {/* ── 中景の丘（手前） ── */}
      <svg
        className="absolute left-0 w-full"
        style={{ bottom: "30%", height: "130px" }}
        viewBox="0 0 800 130"
        preserveAspectRatio="none"
      >
        <path
          d="M0,85 C70,30 175,105 310,52 C435,10 555,95 700,42 C762,20 788,62 800,52 L800,130 L0,130 Z"
          fill="#5A9E38"
        />
      </svg>

      {/* ── 杉の木（左岸） ── */}
      <svg
        className="absolute left-0"
        style={{ bottom: "29%", height: "110px", width: "45%" }}
        viewBox="0 0 360 110"
        preserveAspectRatio="xMinYMax meet"
      >
        <g transform="translate(28,110)">
          <rect x="-4" y="-14" width="8" height="14" fill="#6D4C41" />
          <polygon points="0,-90 -19,-35 19,-35" fill="#2D6A4F" />
          <polygon points="0,-68 -24,-18 24,-18" fill="#40916C" />
        </g>
        <g transform="translate(78,110)">
          <rect x="-3" y="-12" width="6" height="12" fill="#6D4C41" />
          <polygon points="0,-75 -15,-30 15,-30" fill="#1B4332" />
          <polygon points="0,-55 -19,-14 19,-14" fill="#2D6A4F" />
        </g>
        <g transform="translate(140,110)">
          <rect x="-4" y="-13" width="8" height="13" fill="#6D4C41" />
          <polygon points="0,-82 -17,-32 17,-32" fill="#40916C" />
          <polygon points="0,-60 -21,-17 21,-17" fill="#52B788" />
        </g>
        <g transform="translate(200,110)">
          <rect x="-3" y="-11" width="6" height="11" fill="#6D4C41" />
          <polygon points="0,-68 -14,-27 14,-27" fill="#2D6A4F" />
          <polygon points="0,-50 -18,-13 18,-13" fill="#40916C" />
        </g>
      </svg>

      {/* ── 杉の木（右岸） ── */}
      <svg
        className="absolute right-0"
        style={{ bottom: "29%", height: "110px", width: "40%" }}
        viewBox="0 0 320 110"
        preserveAspectRatio="xMaxYMax meet"
      >
        <g transform="translate(295,110)">
          <rect x="-4" y="-14" width="8" height="14" fill="#6D4C41" />
          <polygon points="0,-85 -18,-33 18,-33" fill="#2D6A4F" />
          <polygon points="0,-62 -22,-16 22,-16" fill="#40916C" />
        </g>
        <g transform="translate(238,110)">
          <rect x="-3" y="-12" width="6" height="12" fill="#6D4C41" />
          <polygon points="0,-74 -15,-29 15,-29" fill="#1B4332" />
          <polygon points="0,-54 -19,-13 19,-13" fill="#2D6A4F" />
        </g>
        <g transform="translate(175,110)">
          <rect x="-4" y="-13" width="8" height="13" fill="#6D4C41" />
          <polygon points="0,-80 -16,-31 16,-31" fill="#40916C" />
          <polygon points="0,-58 -20,-16 20,-16" fill="#52B788" />
        </g>
        <g transform="translate(115,110)">
          <rect x="-3" y="-11" width="6" height="11" fill="#6D4C41" />
          <polygon points="0,-65 -13,-26 13,-26" fill="#2D6A4F" />
          <polygon points="0,-48 -17,-12 17,-12" fill="#40916C" />
        </g>
      </svg>

      {/* ── 川エリア ── */}
      <div
        className="absolute left-0 right-0"
        style={{ bottom: "17%", height: "140px", overflow: "hidden" }}
      >
        {/* 水のベース（深みのあるグラデーション） */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #1E88E5 0%, #1565C0 60%, #0D47A1 100%)",
          }}
        />
        {/* 水面の透明レイヤー */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(100,181,246,0.35) 0%, rgba(13,71,161,0.5) 100%)",
          }}
        />

        {/* 波レイヤー1（最速・周期160・10周期=1600） */}
        <svg
          className="river-wave-1 absolute top-18 left-0"
          style={{ width: "200%", height: "24px" }}
          viewBox="0 0 1600 48"
          preserveAspectRatio="none"
        >
          <path
            d="M0,24 C40,6 40,6 80,24 C120,42 120,42 160,24 C200,6 200,6 240,24 C280,42 280,42 320,24 C360,6 360,6 400,24 C440,42 440,42 480,24 C520,6 520,6 560,24 C600,42 600,42 640,24 C680,6 680,6 720,24 C760,42 760,42 800,24 C840,6 840,6 880,24 C920,42 920,42 960,24 C1000,6 1000,6 1040,24 C1080,42 1080,42 1120,24 C1160,6 1160,6 1200,24 C1240,42 1240,42 1280,24 C1320,6 1320,6 1360,24 C1400,42 1400,42 1440,24 C1480,6 1480,6 1520,24 C1560,42 1560,42 1600,24 L1600,48 L0,48 Z"
            fill="rgba(255,255,255,0.28)"
          />
        </svg>

        {/* 波レイヤー2（周期200・8周期=1600） */}
        <svg
          className="river-wave-2 absolute top-2 left-0"
          style={{ width: "200%", height: "21px" }}
          viewBox="0 0 1600 42"
          preserveAspectRatio="none"
        >
          <path
            d="M0,21 C50,5 50,5 100,21 C150,37 150,37 200,21 C250,5 250,5 300,21 C350,37 350,37 400,21 C450,5 450,5 500,21 C550,37 550,37 600,21 C650,5 650,5 700,21 C750,37 750,37 800,21 C850,5 850,5 900,21 C950,37 950,37 1000,21 C1050,5 1050,5 1100,21 C1150,37 1150,37 1200,21 C1250,5 1250,5 1300,21 C1350,37 1350,37 1400,21 C1450,5 1450,5 1500,21 C1550,37 1550,37 1600,21 L1600,42 L0,42 Z"
            fill="rgba(255,255,255,0.18)"
          />
        </svg>

        {/* 波レイヤー3（周期400・4周期=1600） */}
        <svg
          className="river-wave-3 absolute top-5 left-0"
          style={{ width: "200%", height: "36px" }}
          viewBox="0 0 1600 36"
          preserveAspectRatio="none"
        >
          <path
            d="M0,18 C100,4 100,4 200,18 C300,32 300,32 400,18 C500,4 500,4 600,18 C700,32 700,32 800,18 C900,4 900,4 1000,18 C1100,32 1100,32 1200,18 C1300,4 1300,4 1400,18 C1500,32 1500,32 1600,18 L1600,36 L0,36 Z"
            fill="rgba(144,202,249,0.22)"
          />
        </svg>

        {/* 波レイヤー4（最遅・周期800・2周期=1600） */}
        <svg
          className="river-wave-4 absolute top-8 left-0"
          style={{ width: "200%", height: "38px" }}
          viewBox="0 0 1600 38"
          preserveAspectRatio="none"
        >
          <path
            d="M0,19 C200,5 200,5 400,19 C600,33 600,33 800,19 C1000,5 1000,5 1200,19 C1400,33 1400,33 1600,19 L1600,38 L0,38 Z"
            fill="rgba(255,255,255,0.12)"
          />
        </svg>

        {/* きらめき（光の反射ライン） */}
        <div
          className="river-shimmer absolute"
          style={{
            top: "22%",
            left: "-40%",
            width: "55%",
            height: "5px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
            transform: "skewX(-25deg)",
            borderRadius: "4px",
          }}
        />
        {/* きらめき2 */}
        <div
          className="river-shimmer-2 absolute"
          style={{
            top: "50%",
            left: "-40%",
            width: "35%",
            height: "3px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
            transform: "skewX(-25deg)",
            borderRadius: "4px",
          }}
        />

        {/* 泡（川の流れで浮かぶ） */}
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className="bubble-rise absolute rounded-full"
            style={{
              left: b.left,
              bottom: "8px",
              width: "6px",
              height: "6px",
              background: "rgba(255,255,255,0.65)",
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          />
        ))}
      </div>

      {/* ── 川の手前の草 ── */}
      <svg
        className="absolute left-0 w-full"
        style={{ bottom: "15%", height: "75px" }}
        viewBox="0 0 800 75"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C60,12 130,62 220,30 C310,5 390,55 480,28 C570,5 650,50 730,22 C768,10 788,40 800,30 L800,75 L0,75 Z"
          fill="#5DA83A"
        />
      </svg>

      {/* ── 手前の草地 ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "17%",
          background: "linear-gradient(180deg, #5DA83A 0%, #4A9030 100%)",
        }}
      />
    </div>
  );
}
