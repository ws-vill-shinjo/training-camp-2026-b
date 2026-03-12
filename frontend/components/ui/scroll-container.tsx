"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const ScrollContainer = ({ children, className }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const ratio = clientHeight / scrollHeight;
    setThumbHeight(Math.max(ratio * clientHeight, 24));
    setThumbTop((scrollTop / scrollHeight) * clientHeight);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateThumb();
    el.addEventListener("scroll", updateThumb);
    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateThumb);
      ro.disconnect();
    };
  }, [updateThumb]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollRef}
        className="h-full overflow-y-scroll pr-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {children}
      </div>
      <div className="absolute right-1 top-0 bottom-0 w-1.5 bg-slate-200 rounded-full pointer-events-none">
        <div
          className="absolute w-full bg-slate-400 rounded-full"
          style={{ top: thumbTop, height: thumbHeight }}
        />
      </div>
    </div>
  );
};
