"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./ToastContext";

interface WishlistContextValue {
  ids: string[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "gizmonepal:wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, hydrated]);

  const has = (id: string) => ids.includes(id);

  const toggle = (id: string) => {
    setIds((prev) => {
      const exists = prev.includes(id);
      if (exists) return prev.filter((x) => x !== id);
      show("Saved to wishlist", "heart");
      return [...prev, id];
    });
  };

  return (
    <WishlistContext.Provider
      value={{ ids, isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false), has, toggle }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
