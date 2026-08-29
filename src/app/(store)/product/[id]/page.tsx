import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductById, getRelatedProducts } from "@/lib/data";
import { categoryLabel } from "@/lib/constants";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductById(params.id);
  return { title: product ? `${product.name} — GizmoNepal` : "Product — GizmoNepal" };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.id);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 px-[18px] pt-4 text-xs text-ink-soft sm:px-8 lg:px-14">
        <Link href="/" className="font-semibold text-accent">Home</Link>
        <Icon name="chevron-r" className="h-3 w-3" />
        <Link href={`/category/${product.category}`} className="font-semibold text-accent">
          {categoryLabel(product.category)}
        </Link>
        <Icon name="chevron-r" className="h-3 w-3" />
        <span className="truncate">{product.name}</span>
      </div>

      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="px-[18px] pb-16 sm:px-8 lg:px-14">
          <div className="mb-3.5">
            <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[.12em] text-accent">You might also like</div>
            <h2 className="mt-1 font-display text-lg font-semibold">Related products</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} className="w-[210px]" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
