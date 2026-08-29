"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import ProductMedia from "@/components/ProductMedia";
import { fmt } from "@/lib/format";
import { useSearch } from "@/context/SearchContext";
import { useCart } from "@/context/CartContext";
import { useProductsCache } from "@/context/ProductsCacheContext";

export default function SearchOverlay() {
  const search = useSearch();
  const cart = useCart();
  const { products } = useProductsCache();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search.isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    } else {
      setQuery("");
    }
  }, [search.isOpen]);

  const q = query.trim().toLowerCase();
  const matches = q ? products.filter((p) => p.name.toLowerCase().includes(q) || p.category.includes(q)) : [];

  return (
    <div
      className={`fixed inset-0 z-[95] flex flex-col bg-bg transition-transform duration-300 ease-[cubic-bezier(.2,.85,.3,1)] lg:inset-auto lg:left-1/2 lg:top-[84px] lg:max-h-[70vh] lg:w-[560px] lg:max-w-[calc(100%-64px)] lg:-translate-x-1/2 lg:rounded-[22px] lg:border lg:border-line lg:shadow-[0_24px_60px_rgba(12,13,16,.18)] ${
        search.isOpen ? "translate-y-0 opacity-100 lg:pointer-events-auto lg:!translate-x-[-50%]" : "-translate-y-full opacity-0 lg:pointer-events-none lg:translate-y-[-14px]"
      }`}
    >
      <div className="flex items-center gap-2.5 border-b border-line p-4 sm:px-8 lg:rounded-t-[22px] lg:px-6">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-line bg-surface px-3.5 py-2.5">
          <Icon name="search" className="h-5 w-5 stroke-ink-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phones, drones, watches…"
            className="flex-1 bg-transparent text-[13.5px] outline-none"
          />
        </div>
        <button onClick={search.close} className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-line">
          <Icon name="x" className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:px-8 lg:px-6 lg:pb-8">
        {!q ? (
          <div className="py-8 text-center text-xs text-ink-faint">Try &ldquo;iPhone&rdquo;, &ldquo;drone&rdquo;, or &ldquo;watch&rdquo;</div>
        ) : matches.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink-faint">No results for &ldquo;{query}&rdquo;</div>
        ) : (
          matches.map((p) => (
            <div key={p.id} className="flex items-center gap-3 border-b border-line py-2.5">
              <Link href={`/product/${p.id}`} onClick={search.close} className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                <ProductMedia src={p.image_url} alt={p.name} tile={p.tile} iconClassName="h-4 w-4" />
              </Link>
              <Link href={`/product/${p.id}`} onClick={search.close} className="min-w-0 flex-1">
                <h5 className="mb-1 truncate text-[12.5px] font-semibold">{p.name}</h5>
                <div className="font-mono text-xs">{fmt(p.old_price || p.price)}</div>
              </Link>
              <button onClick={() => cart.add(p.id)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-ink text-white">
                <Icon name="plus" className="h-3.5 w-3.5 stroke-white" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
