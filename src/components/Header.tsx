"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";

const NAV_LINKS = [
  { href: "/category/phone", label: "Phones" },
  { href: "/category/tablet", label: "iPad" },
  { href: "/category/laptop", label: "MacBook" },
  { href: "/category/watch", label: "Watches" },
  { href: "/category/drone", label: "Drones" },
  { href: "/category/audio", label: "Audio" },
  { href: "/category/sale", label: "On Sale" },
];

export default function Header() {
  const cart = useCart();
  const search = useSearch();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-5 border-b border-line bg-bg/80 px-[18px] py-3.5 backdrop-blur-lg sm:px-8 lg:px-14 lg:py-5">
      <Link href="/" className="flex shrink-0 items-center gap-1.5 font-display text-xl font-bold tracking-tight">
        GIZMONEPAL<span className="-mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
      </Link>

      <nav className="hidden flex-1 items-center gap-6 lg:flex">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="text-[13px] font-semibold text-ink-soft transition-colors hover:text-accent">
            {l.label}
          </Link>
        ))}
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
