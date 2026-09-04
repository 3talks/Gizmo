"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";
import type { SubCategory } from "@/lib/types";

const NAV_LINKS = [
  { key: "phone", href: "/category/phone", label: "Phones" },
  { key: "tablet", href: "/category/tablet", label: "iPad" },
  { key: "laptop", href: "/category/laptop", label: "MacBook" },
  { key: "watch", href: "/category/watch", label: "Watches" },
  { key: "drone", href: "/category/drone", label: "Drones" },
  { key: "audio", href: "/category/audio", label: "Audio" },
  { key: "sale", href: "/category/sale", label: "On Sale" },
];

export default function Header({ subcategoriesByCategory = {} }: { subcategoriesByCategory?: Record<string, SubCategory[]> }) {
  const cart = useCart();
  const search = useSearch();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close on outside click, and on Escape — since the dropdown can be
  // click-opened (not just hover), it needs its own explicit close paths.
  useEffect(() => {
    if (!openKey) return;
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenKey(null);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenKey(null);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [openKey]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-5 border-b border-line bg-bg/80 px-[18px] py-3.5 backdrop-blur-lg sm:px-8 lg:px-14 lg:py-5">
      <Link href="/" className="flex shrink-0 items-center gap-1.5 font-display text-xl font-bold tracking-tight">
        OLIZ<span className="-mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
      </Link>

      <nav ref={navRef} className="hidden flex-1 items-center gap-1 lg:flex">
        {NAV_LINKS.map((l) => {
          const subs = subcategoriesByCategory[l.key];
          const hasSubs = !!subs && subs.length > 0;
          const isOpen = openKey === l.key;

          return (
            <div
              key={l.key}
              className="relative"
              onMouseEnter={() => hasSubs && setOpenKey(l.key)}
              onMouseLeave={() => setOpenKey((k) => (k === l.key ? null : k))}
            >
              <Link
                href={l.href}
                onClick={(e) => {
                  if (hasSubs) {
                    e.preventDefault();
                    setOpenKey((k) => (k === l.key ? null : l.key));
                  }
                }}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-semibold text-ink-soft transition-colors hover:text-accent"
              >
                {l.label}
                {hasSubs && (
                  <Icon name="chevron-d" className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                )}
              </Link>

              {hasSubs && (
                <div
                  className={`absolute left-0 top-full z-50 min-w-[200px] rounded-2xl border border-line bg-surface p-1.5 shadow-pop transition-all duration-150 ${
                    isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpenKey(null)}
                    className="block rounded-xl px-3 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint hover:bg-bg"
                  >
                    All {l.label}
                  </Link>
                  <div className="my-1 h-px bg-line" />
                  {subs!.map((s) => (
                    <Link
                      key={s.id}
                      href={s.href}
                      onClick={() => setOpenKey(null)}
                      className="block rounded-xl px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-bg hover:text-accent"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button
        onClick={search.open}
        className="hidden w-[230px] shrink-0 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-ink-faint lg:flex"
      >
        <Icon name="search" className="h-[15px] w-[15px]" />
        <span className="text-xs">Search products…</span>
      </button>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          onClick={search.open}
          aria-label="Search"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-line bg-surface transition-transform active:scale-90 lg:hidden"
        >
          <Icon name="search" className="h-5 w-5" />
        </button>
        <button
          onClick={cart.open}
          aria-label="Cart"
          className="relative flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-line bg-surface transition-transform active:scale-90"
        >
          <Icon name="bag" className="h-5 w-5" />
          {cart.count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-lg bg-amber px-1 font-mono text-[9.5px] font-semibold text-white ring-2 ring-bg">
              {cart.count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
