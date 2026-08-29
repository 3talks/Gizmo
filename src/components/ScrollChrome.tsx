"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

export default function ScrollChrome() {
  const [pct, setPct] = useState(0);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      setPct(height > 0 ? (scrollTop / height) * 100 : 0);
      setShowFab(scrollTop > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="sticky top-0 z-[70] h-[3px] w-full">
        <i className="block h-full bg-gradient-to-r from-accent to-amber transition-[width] duration-100" style={{ width: `${pct}%` }} />
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-[82px] right-4 z-[55] flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white shadow-pop transition-all lg:bottom-[26px] lg:right-8 ${
          showFab ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"
        }`}
      >
        <Icon name="chevron-d" className="h-[17px] w-[17px] rotate-180 stroke-white" />
      </button>
    </>
  );
}
