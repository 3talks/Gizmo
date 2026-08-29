"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export default function CategoryGrid({ products, title }: { products: Product[]; title: string }) {
  const [sort, setSort] = useState<SortKey>("featured");

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "price-asc") list.sort((a, b) => (a.old_price || a.price) - (b.old_price || b.price));
    else if (sort === "price-desc") list.sort((a, b) => (b.old_price || b.price) - (a.old_price || a.price));
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, sort]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3 px-[18px] pb-3.5 pt-3 sm:px-8 lg:px-14">
        <div>
          <h1 className="font-display text-[23px] font-semibold tracking-tight lg:text-2xl">{title}</h1>
          <div className="mt-1 font-mono text-[10.5px] uppercase tracking-wide text-ink-faint">
            {sorted.length} {sorted.length === 1 ? "item" : "items"}
          </div>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-[10px] border border-line bg-surface px-2.5 py-2 font-mono text-[11.5px] text-ink-soft"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <div className="px-[18px] py-14 text-center text-ink-soft sm:px-8 lg:px-14">
          <Icon name="bag" className="mx-auto mb-2.5 h-8 w-8 stroke-ink-faint" />
          <div>No products in this category yet</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 px-[18px] pb-14 sm:grid-cols-3 sm:px-8 lg:grid-cols-4 lg:px-14">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
