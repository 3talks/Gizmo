"use client";

import Icon from "@/components/Icon";
import ProductMedia from "@/components/ProductMedia";
import { fmt } from "@/lib/format";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useProductsCache } from "@/context/ProductsCacheContext";

export default function WishlistDrawer() {
  const wishlist = useWishlist();
  const cart = useCart();
  const { byId } = useProductsCache();

  const products = wishlist.ids.map(byId).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <>
      <div
        onClick={wishlist.close}
        className={`fixed inset-0 z-[80] bg-[rgba(12,13,18,.5)] backdrop-blur-[2px] transition-opacity ${
          wishlist.isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-[90] mx-auto flex max-h-[82vh] max-w-[600px] flex-col rounded-t-[26px] bg-surface px-[18px] pb-[calc(20px+env(safe-area-inset-bottom))] pt-2 transition-transform duration-[380ms] ease-[cubic-bezier(.2,.85,.3,1)] lg:inset-y-0 lg:right-0 lg:left-auto lg:max-h-none lg:w-[420px] lg:max-w-[420px] lg:rounded-none lg:px-6 lg:pb-6 lg:pt-2.5 lg:shadow-[-16px_0_40px_rgba(12,13,16,.12)] ${
          wishlist.isOpen ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-x-full"
        }`}
      >
        <div className="mx-auto mb-3 mt-2 h-1 w-9 rounded-full bg-line lg:hidden" />
        <div className="mb-3.5 flex items-center justify-between">
          <h3 className="font-display text-[17px]">Saved items</h3>
          <button onClick={wishlist.close} className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-line">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {products.length === 0 ? (
            <div className="py-10 text-center text-ink-soft">
              <Icon name="heart" className="mx-auto mb-2.5 h-9 w-9 stroke-ink-faint" />
              <div>No saved items yet</div>
            </div>
          ) : (
            products.map((p) => (
              <div key={p.id} className="flex items-center gap-3 border-b border-line py-2.5">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                  <ProductMedia src={p.image_url} alt={p.name} tile={p.tile} iconClassName="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="mb-1 truncate text-[12.5px] font-semibold">{p.name}</h5>
                  <div className="font-mono text-xs">{fmt(p.old_price || p.price)}</div>
                </div>
                <button
                  onClick={() => cart.add(p.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-ink text-white"
                >
                  <Icon name="plus" className="h-3.5 w-3.5 stroke-white" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
