"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

interface ProductsCacheValue {
  products: Product[];
  loading: boolean;
  byId: (id: string) => Product | undefined;
}

const ProductsCacheContext = createContext<ProductsCacheValue>({
  products: [],
  loading: true,
  byId: () => undefined,
});

export function ProductsCacheProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .then(({ data, error }) => {
        if (!error && data) setProducts(data);
        setLoading(false);
      });
  }, []);

  const byId = (id: string) => products.find((p) => p.id === id);

  return (
    <ProductsCacheContext.Provider value={{ products, loading, byId }}>{children}</ProductsCacheContext.Provider>
  );
}

export function useProductsCache() {
  return useContext(ProductsCacheContext);
}
