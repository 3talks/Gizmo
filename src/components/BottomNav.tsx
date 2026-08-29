"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearch } from "@/context/SearchContext";

export default function BottomNav() {
  const pathname = usePathname();
  const cart = useCart();
  const wishlist = useWishlist();
  const search = useSearch();

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/category");

  const itemClass = (active: boolean) =>
    `relative flex flex-col items-center gap-0.5 rounded-2xl px-2.5 py-1 font-mono text-[9.5px] font-semibold transition-colors ${
      active ? "text-accent" : "text-ink-faint"
    }`;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[60] mx-auto flex max-w-[600px] items-center justify-around rounded-t-[22px] border-t border-line bg-white/88 px-2.5 pb-[calc(9px+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      <Link href="/" className={itemClass(isHome)}>
        {isHome && <span className="absolute -top-2 h-[3px] w-[22px] rounded-full bg-accent" />}
        <Icon name="home" className="h-[21px] w-[21px]" />
        <span>Home</span>
      </Link>
      <Link href="/category/all" className={itemClass(isShop)}>
        {isShop && <span className="absolute -top-2 h-[3px] w-[22px] rounded-full bg-accent" />}
        <Icon name="grid" className="h-[21px] w-[21px]" />
        <span>Shop</span>
      </Link>
      <button onClick={search.open} className={itemClass(false)}>
        <Icon name="search" className="h-[21px] w-[21px]" />
        <span>Search</span>
      </button>
      <button onClick={wishlist.open} className={itemClass(false)}>
        <Icon name="heart" className="h-[21px] w-[21px]" />
        <span>Saved</span>
        {wishlist.ids.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-lg bg-amber px-1 font-mono text-[9.5px] font-semibold text-white ring-2 ring-bg">
            {wishlist.ids.length}
          </span>
        )}
      </button>
      <button onClick={cart.open} className={itemClass(false)}>
        <Icon name="bag" className="h-[21px] w-[21px]" />
        <span>Cart</span>
        {cart.count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-lg bg-amber px-1 font-mono text-[9.5px] font-semibold text-white ring-2 ring-bg">
            {cart.count}
          </span>
        )}
      </button>
    </nav>
  );
}
