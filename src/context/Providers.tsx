"use client";

import { ToastProvider } from "./ToastContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";
import { SearchProvider } from "./SearchContext";
import { ProductsCacheProvider } from "./ProductsCacheContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ProductsCacheProvider>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>{children}</SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductsCacheProvider>
    </ToastProvider>
  );
}
