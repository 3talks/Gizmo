"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/Icon";
import ProductMedia from "@/components/ProductMedia";
import { fmt } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/lib/types";

const RIBBON_LABEL: Record<string, string> = { sale: "Sale", new: "New", best: "Bestseller" };
const RIBBON_CLASS: Record<string, string> = {
  sale: "bg-amber text-white",
  new: "bg-accent text-white",
  best: "bg-ink text-white",
};

export default function ProductCard({ product, className = "" }: { product: Product; className?: string }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const [justAdded, setJustAdded] = useState(false);
  const wished = wishlist.has(product.id);

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group block shrink-0 overflow-hidden rounded-m border border-line bg-surface shadow-card transition-transform active:scale-[0.97] ${className}`}
    >
      <div className="relative h-44 sm:h-48 lg:h-52">
        <ProductMedia src={product.image_url} alt={product.name} tile={product.tile} iconClassName="h-10 w-10" />
        {product.tag && (
          <span className={`absolute left-3 top-3 rounded-full px-2 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wide ${RIBBON_CLASS[product.tag]}`}>
            {RIBBON_LABEL[product.tag]}
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            wishlist.toggle(product.id);
          }}
          aria-label="Toggle wishlist"
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur transition-transform active:scale-90 ${wished ? "text-[#ff3860]" : "text-ink"}`}
        >
          <Icon name="heart" className={`h-[18px] w-[18px] ${wished ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint">{product.category}</div>
        <div className="mb-2 min-h-[40px] text-[14.5px] font-semibold leading-tight">{product.name}</div>
        <div className="mb-2 flex items-center gap-1 text-xs text-ink-soft">
          <Icon name="star" className="h-3 w-3 fill-amber stroke-amber" />
          {product.rating} <span className="text-ink-faint">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {product.old_price && (
              <span className="mr-1.5 font-mono text-[11px] text-ink-faint line-through">{fmt(product.old_price)}</span>
            )}
            <span className="font-mono text-[16px] font-semibold">{fmt(product.old_price || product.price)}</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              cart.add(product.id);
              setJustAdded(true);
              setTimeout(() => setJustAdded(false), 900);
            }}
            aria-label="Add to cart"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-white transition-transform active:scale-[0.85] ${justAdded ? "bg-green" : "bg-ink"}`}
          >
            <Icon name={justAdded ? "check" : "plus"} className="h-4 w-4 stroke-white" />
          </button>
        </div>
      </div>
    </Link>
  );
}
