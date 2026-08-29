import Link from "next/link";
import Hero from "@/components/Hero";
import CategoryChips from "@/components/CategoryChips";
import DealsSection from "@/components/DealsSection";
import TheatreBanner from "@/components/TheatreBanner";
import BrandMarquee from "@/components/BrandMarquee";
import Newsletter from "@/components/Newsletter";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { getAllProducts, getAllBrands, getHeroSlides } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, brands, heroSlides] = await Promise.all([getAllProducts(), getAllBrands(), getHeroSlides()]);
  const featured = products.slice(0, 10);
  const arrivals = products.slice(10, 16);

  return (
    <>
      <Hero slides={heroSlides} />

      <Reveal className="pt-[30px] pb-1.5 sm:pt-[34px] lg:pt-11">
        <div className="mb-3.5 px-[18px] sm:px-8 lg:px-14">
          <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[.12em] text-accent">Browse</div>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight lg:text-2xl">Categories</h2>
        </div>
        <CategoryChips />
      </Reveal>

      <Reveal className="pt-[30px] pb-1.5 sm:pt-[34px] lg:pt-11">
        <div className="mb-3.5 px-[18px] sm:px-8 lg:px-14">
          <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[.12em] text-accent">Exclusive offers</div>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight lg:text-2xl">Don&apos;t miss out</h2>
        </div>
        <DealsSection />
      </Reveal>

      <Reveal className="pt-[30px] pb-1.5 sm:pt-[34px] lg:pt-11">
        <div className="mb-3.5 flex items-end justify-between px-[18px] sm:px-8 lg:px-14">
          <div>
            <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[.12em] text-accent">Handpicked</div>
            <h2 className="mt-1 font-display text-xl font-semibold tracking-tight lg:text-2xl">Featured products</h2>
          </div>
          <Link href="/category/all" className="flex items-center gap-0.5 font-mono text-[11px] text-ink-soft">
            See all <Icon name="chevron-r" className="h-[13px] w-[13px]" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-[18px] pb-2.5 sm:px-8 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-14">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} className="w-[210px] lg:w-auto" />
          ))}
        </div>
      </Reveal>

      <Reveal>
        <TheatreBanner />
      </Reveal>

      <Reveal className="pt-[30px] pb-1.5 sm:pt-[34px] lg:pt-11">
        <div className="mb-3.5 flex items-end justify-between px-[18px] sm:px-8 lg:px-14">
          <div>
            <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[.12em] text-accent">Just landed</div>
            <h2 className="mt-1 font-display text-xl font-semibold tracking-tight lg:text-2xl">New arrivals</h2>
          </div>
          <Link href="/category/all" className="flex items-center gap-0.5 font-mono text-[11px] text-ink-soft">
            See all <Icon name="chevron-r" className="h-[13px] w-[13px]" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 px-[18px] pb-1.5 sm:grid-cols-3 sm:px-8 lg:grid-cols-4 lg:px-14">
          {arrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Reveal>

      <Reveal>
        <BrandMarquee brands={brands} />
      </Reveal>

      <Reveal>
        <Newsletter />
      </Reveal>
    </>
  );
}
