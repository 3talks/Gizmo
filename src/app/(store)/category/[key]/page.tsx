import Link from "next/link";
import Icon from "@/components/Icon";
import CategoryGrid from "@/components/CategoryGrid";
import { getProductsByCategory } from "@/lib/data";
import { categoryLabel } from "@/lib/constants";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { key: string } }): Promise<Metadata> {
  return { title: `${categoryLabel(params.key)} — GizmoNepal` };
}

export default async function CategoryPage({ params }: { params: { key: string } }) {
  const products = await getProductsByCategory(params.key);
  const title = categoryLabel(params.key);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 px-[18px] pt-4 text-xs text-ink-soft sm:px-8 lg:px-14">
        <Link href="/" className="font-semibold text-accent">Home</Link>
        <Icon name="chevron-r" className="h-3 w-3" />
        <span>{title}</span>
      </div>
      <CategoryGrid products={products} title={title} />
    </div>
  );
}
