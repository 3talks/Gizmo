"use client";

import { useEffect, useState } from "react";

function timeLeft() {
  const now = new Date();
  const end = new Date();
  end.setHours(24, 0, 0, 0);
  const diff = Math.max(0, end.getTime() - now.getTime());
  const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function DealCountdown() {
  const [txt, setTxt] = useState("--:--:--");

  useEffect(() => {
    setTxt(timeLeft());
    const timer = setInterval(() => setTxt(timeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return <span className="rounded-lg bg-white/[.16] px-2 py-1 font-mono text-[11px] tracking-wide">{txt}</span>;
}
