"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import ProductMedia from "@/components/ProductMedia";
import { fmt } from "@/lib/format";
import { categoryLabel } from "@/lib/constants";
import { useToast } from "@/context/ToastContext";
import ProductFormDrawer from "@/components/admin/ProductFormDrawer";
import HeroSlideFormDrawer from "@/components/admin/HeroSlideFormDrawer";
import {
  signOutAction,
  deleteProductAction,
  addBrandAction,
  deleteBrandAction,
  deleteHeroSlideAction,
} from "@/app/admin/actions";
import type { Product, Brand, HeroSlide } from "@/lib/types";

export default function AdminDashboardClient({
  products,
  brands,
  heroSlides,
  userEmail,
}: {
  products: Product[];
  brands: Brand[];
  heroSlides: HeroSlide[];
  userEmail: string;
}) {
  const router = useRouter();
  const { show } = useToast();
  const [tab, setTab] = useState<"products" | "brands" | "slides">("products");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null | undefined>(undefined);
  const [brandName, setBrandName] = useState("");

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase())),
    [products, search]
  );
  const onSaleCount = products.filter((p) => p.old_price).length;

  const handleDeleteProduct = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    const result = await deleteProductAction(p.id);
    if (result && "error" in result && result.error) {
      show(result.error, "x");
      return;
    }
    show("Product deleted", "check");
    router.refresh();
  };

  const handleAddBrand = async () => {
    const result = await addBrandAction(brandName);
    if (result && "error" in result && result.error) {
      show(result.error, "x");
      return;
    }
    setBrandName("");
    show("Brand added", "check");
    router.refresh();
  };

  const handleDeleteBrand = async (b: Brand) => {
    if (!confirm(`Delete brand "${b.name}"?`)) return;
    const result = await deleteBrandAction(b.id);
    if (result && "error" in result && result.error) {
      show(result.error, "x");
      return;
    }
    show("Brand deleted", "check");
    router.refresh();
  };

  const handleDeleteSlide = async (s: HeroSlide) => {
    if (!confirm(`Delete slide "${s.title_line1}"?`)) return;
    const result = await deleteHeroSlideAction(s.id);
    if (result && "error" in result && result.error) {
      show(result.error, "x");
      return;
    }
    show("Slide deleted", "check");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-2.5 border-b border-line bg-bg/90 px-[18px] py-3.5 backdrop-blur-lg lg:px-14 lg:py-4.5">
        <div className="flex items-center gap-1.5 font-display text-xl font-bold tracking-tight">
          GIZMONEPAL<span className="-mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="ml-1.5 text-xs font-semibold text-ink-faint">Admin · {userEmail}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1.5 rounded-[10px] border border-line px-3.5 py-2 text-xs font-semibold text-ink-soft">
            <Icon name="chevron-l" className="h-3.5 w-3.5" />
            View store
          </Link>
          <button
            onClick={() => signOutAction()}
            className="flex items-center gap-1.5 rounded-[10px] border border-line px-3.5 py-2 text-xs font-semibold text-ink-soft"
          >
            <Icon name="logout" className="h-3.5 w-3.5" />
            Log out
          </button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-2.5 px-[18px] pb-1 pt-4.5 lg:grid-cols-[repeat(4,190px)] lg:px-14 lg:pt-6">
        <StatCard value={products.length} label="Products" />
        <StatCard value={brands.length} label="Brands" />
        <StatCard value={onSaleCount} label="On sale" />
        <StatCard value={heroSlides.length} label="Hero slides" />
      </div>

      <div className="flex gap-2 px-[18px] pt-4.5 lg:px-14 lg:pt-5.5">
        <TabButton active={tab === "products"} onClick={() => setTab("products")}>Products</TabButton>
        <TabButton active={tab === "brands"} onClick={() => setTab("brands")}>Brands</TabButton>
        <TabButton active={tab === "slides"} onClick={() => setTab("slides")}>Hero slides</TabButton>
      </div>

      {tab === "products" ? (
        <div className="px-[18px] pb-16 pt-4 lg:px-14 lg:pb-[70px]">
          <div className="mb-3.5 flex flex-wrap gap-2.5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="min-w-[150px] flex-1 rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-[12.5px]"
            />
            <button
              onClick={() => setEditing(null)}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-ink px-4.5 py-2.5 text-[12.5px] font-semibold text-white transition-transform active:scale-95"
            >
              <Icon name="plus" className="h-3.5 w-3.5 stroke-white" />
              Add product
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="py-10 text-center text-[12.5px] text-ink-faint">No products found</div>
          ) : (
            <div className="max-w-[760px]">
              {filtered.map((p) => (
                <div key={p.id} className="mb-2.5 flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                    <ProductMedia src={p.image_url} alt={p.name} tile={p.tile} iconClassName="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="mb-0.5 truncate text-[12.5px] font-semibold">{p.name}</h5>
                    <div className="font-mono text-[10.5px] text-ink-faint">
                      {categoryLabel(p.category)} · {fmt(p.old_price || p.price)}
                      {p.brand ? ` · ${p.brand}` : ""}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      onClick={() => setEditing(p)}
                      aria-label="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-line"
                    >
                      <Icon name="edit" className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p)}
                      aria-label="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#ffd7de] text-[#ff3860]"
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : tab === "brands" ? (
        <div className="px-[18px] pb-16 pt-4 lg:px-14 lg:pb-[70px]">
          <div className="mb-3.5 flex flex-wrap gap-2.5">
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="New brand name…"
              className="min-w-[150px] flex-1 rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-[12.5px]"
            />
            <button
              onClick={handleAddBrand}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-ink px-4.5 py-2.5 text-[12.5px] font-semibold text-white transition-transform active:scale-95"
            >
              <Icon name="plus" className="h-3.5 w-3.5 stroke-white" />
              Add brand
            </button>
          </div>

          {brands.length === 0 ? (
            <div className="py-10 text-center text-[12.5px] text-ink-faint">No brands yet</div>
          ) : (
            <div className="max-w-[760px]">
              {brands.map((b) => (
                <div key={b.id} className="mb-2.5 flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
                    <Icon name="plug" className="h-5 w-5 stroke-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="mb-0.5 text-[12.5px] font-semibold">{b.name}</h5>
                    <div className="font-mono text-[10.5px] text-ink-faint">
                      {products.filter((p) => p.brand === b.name).length} products
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBrand(b)}
                    aria-label="Delete"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[#ffd7de] text-[#ff3860]"
                  >
                    <Icon name="trash" className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="px-[18px] pb-16 pt-4 lg:px-14 lg:pb-[70px]">
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5">
            <p className="max-w-[420px] text-xs text-ink-soft">
              These appear as the browsable banners at the top of the homepage. Lower &ldquo;order&rdquo; shows first.
            </p>
            <button
              onClick={() => setEditingSlide(null)}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-ink px-4.5 py-2.5 text-[12.5px] font-semibold text-white transition-transform active:scale-95"
            >
              <Icon name="plus" className="h-3.5 w-3.5 stroke-white" />
              Add slide
            </button>
          </div>

          {heroSlides.length === 0 ? (
            <div className="py-10 text-center text-[12.5px] text-ink-faint">No hero slides yet — the homepage banner will be hidden until you add one.</div>
          ) : (
            <div className="max-w-[760px]">
              {heroSlides.map((s) => (
                <div key={s.id} className="mb-2.5 flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5">
                  <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-xl">
                    {s.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            s.color_from && s.color_to
                              ? s.color_via
                                ? `linear-gradient(135deg, ${s.color_from}, ${s.color_via} 55%, ${s.color_to})`
                                : `linear-gradient(135deg, ${s.color_from}, ${s.color_to})`
                              : "linear-gradient(135deg, #12141A, #454b5e)",
                        }}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="mb-0.5 truncate text-[12.5px] font-semibold">
                      {s.title_line1}
                      {s.title_line2 ? ` ${s.title_line2}` : ""}
                    </h5>
                    <div className="font-mono text-[10.5px] text-ink-faint">
                      Order {s.sort_order} · links to {s.href}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      onClick={() => setEditingSlide(s)}
                      aria-label="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-line"
                    >
                      <Icon name="edit" className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(s)}
                      aria-label="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#ffd7de] text-[#ff3860]"
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ProductFormDrawer
        product={editing}
        brands={brands}
        onClose={() => setEditing(undefined)}
        onSaved={() => {
          setEditing(undefined);
          show(editing ? "Product updated" : "Product added", "check");
          router.refresh();
        }}
      />

      <HeroSlideFormDrawer
        slide={editingSlide}
        nextSortOrder={heroSlides.length ? Math.max(...heroSlides.map((s) => s.sort_order)) + 1 : 1}
        onClose={() => setEditingSlide(undefined)}
        onSaved={() => {
          setEditingSlide(undefined);
          show(editingSlide ? "Slide updated" : "Slide added", "check");
          router.refresh();
        }}
      />
    </>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-3.5">
      <b className="mb-0.5 block font-display text-[21px]">{value}</b>
      <span className="font-mono text-[9.5px] uppercase tracking-wide text-ink-soft">{label}</span>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-[12.5px] font-semibold transition-colors ${
        active ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink-soft"
      }`}
    >
      {children}
    </button>
  );
}
