export type ProductTag = "new" | "sale" | "best" | null;

export interface Product {
  id: string;
  name: string;
  category: string;
  icon: string;
  image_url: string | null;
  price: number;
  old_price: number | null;
  rating: number;
  reviews: number;
  tag: ProductTag;
  tile: string;
  brand: string | null;
  created_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  created_at?: string;
}

export interface HeroSlide {
  id: string;
  tag: string;
  title_line1: string;
  title_line2: string;
  subtitle: string;
  href: string;
  image_url: string | null;
  color_from: string | null;
  color_via: string | null;
  color_to: string | null;
  sort_order: number;
  created_at?: string;
}

export interface SubCategory {
  id: string;
  category: string;
  name: string;
  href: string;
  sort_order: number;
  created_at?: string;
}

export interface Category {
  key: string;
  label: string;
  icon: string;
}
