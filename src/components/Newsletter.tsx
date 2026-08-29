"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { show } = useToast();

  const subscribe = () => {
    if (email.includes("@")) {
      show("Subscribed — welcome!", "check");
      setEmail("");
    } else {
      show("Enter a valid email", "x");
    }
  };

  return (
    <div className="mx-[18px] my-6 rounded-l border border-[#d3daff] bg-accent-soft p-5 text-center sm:mx-8 lg:mx-14 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-9 lg:text-left">
      <div>
        <h4 className="mb-1.5 font-display text-lg font-semibold lg:text-xl">Get the drop first</h4>
        <p className="mb-4 text-xs text-ink-soft lg:mb-0 lg:max-w-[360px]">New launches, restocks & member-only prices — no spam.</p>
      </div>
      <div className="flex gap-2 lg:w-[340px] lg:shrink-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="flex-1 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[12.5px] focus:outline focus:outline-2 focus:outline-accent"
        />
        <button onClick={subscribe} className="rounded-xl bg-ink px-4 font-mono text-[11.5px] font-semibold text-white transition-transform active:scale-95">
          Notify me
        </button>
      </div>
    </div>
  );
}
