"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import ProductMedia from "@/components/ProductMedia";
import { fmt } from "@/lib/format";
import { categoryLabel } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/lib/types";

const RIBBON_LABEL: Record<string, string> = { sale: "Sale", new: "New", best: "Bestseller" };
const RIBBON_CLASS: Record<string, string> = {
  sale: "bg-amber text-white",
  new: "bg-accent text-white",
  best: "bg-ink text-white",
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line py-2.5 text-[12.5px]">
      <span className="text-ink-soft">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const [qty, setQty] = useState(1);
  const wished = wishlist.has(product.id);

  return (
    <div className="grid gap-8 px-[18px] pb-14 pt-4 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-14 lg:pt-8">
      <div className="relative h-[260px] overflow-hidden rounded-l lg:h-[440px]">
        <ProductMedia src={product.image_url} alt={product.name} tile={product.tile} iconClassName="h-16 w-16" />
        {product.tag && (
          <span className={`absolute left-3.5 top-3.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${RIBBON_CLASS[product.tag]}`}>
            {RIBBON_LABEL[product.tag]}
          </span>
        )}
        <button
          onClick={() => wishlist.toggle(product.id)}
          aria-label="Toggle wishlist"
          className={`absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur ${wished ? "text-[#ff3860]" : "text-ink"}`}
        >
          <Icon name="heart" className={`h-[18px] w-[18px] ${wished ? "fill-current" : ""}`} />
        </button>
      </div>

      <div>
        {product.brand && (
          <div className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-accent">{product.brand}</div>
        )}
        <h1 className="mb-2 font-display text-[23px] font-semibold leading-tight lg:text-[26px]">{product.name}</h1>
        <div className="mb-3.5 flex items-center gap-1.5 text-xs text-ink-soft">
          <Icon name="star" className="h-[13px] w-[13px] fill-amber stroke-amber" />
          {product.rating} <span className="text-ink-faint">({product.reviews} reviews)</span>
        </div>
        <div className="mb-4.5 flex items-baseline gap-2.5">
          {product.old_price && <span className="font-mono text-sm text-ink-faint line-through">{fmt(product.old_price)}</span>}
          <span className="font-mono text-[22px] font-semibold">{fmt(product.old_price || product.price)}</span>
        </div>

        <div className="mb-4.5 flex items-center gap-3.5">
          <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-2.5 py-1.5">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-line">
              <Icon name="minus" className="h-3 w-3" />
            </button>
            <span className="min-w-[20px] text-center text-[13px]">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-line">
              <Icon name="plus" className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="mb-6.5 flex gap-2.5">
          <button
            onClick={() => cart.add(product.id, qty)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 text-[13.5px] font-semibold text-white transition-transform active:scale-[0.97]"
          >
            <Icon name="bag" className="h-[15px] w-[15px] stroke-white" />
            Add to cart
          </button>
          <button
            onClick={() => wishlist.toggle(product.id)}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface transition-transform active:scale-90 ${wished ? "text-[#ff3860]" : "text-ink"}`}
          >
            <Icon name="heart" className={`h-[19px] w-[19px] ${wished ? "fill-current" : ""}`} />
          </button>
        </div>

        <p className="mb-5.5 text-[13px] leading-relaxed text-ink-soft">
          The {product.name} blends premium build quality with everyday reliability — a top pick in our{" "}
          {categoryLabel(product.category).toLowerCase()} lineup, backed by official warranty and local support across Nepal.
        </p>

        <div className="border-t border-line pt-1">
          <SpecRow label="Brand" value={product.brand || "—"} />
          <SpecRow label="Category" value={categoryLabel(product.category)} />
          <SpecRow label="Warranty" value="1 year official warranty" />
          <SpecRow label="Availability" value="Ships within 2–3 days" />
        </div>
      </div>
    </div>
  );
}
