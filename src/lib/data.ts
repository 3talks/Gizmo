import { createClient } from "@/lib/supabase/server";
import type { Product, Brand, HeroSlide, SubCategory } from "@/lib/types";

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getAllProducts error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProductsByCategory(key: string): Promise<Product[]> {
  const all = await getAllProducts();
  if (key === "all") return all;
  if (key === "sale") return all.filter((p) => p.old_price);
  return all.filter((p) => p.category === key);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getProductById error:", error.message);
    return null;
  }
  return data;
}

export async function getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", excludeId)
    .limit(8);

  if (error) {
    console.error("getRelatedProducts error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAllBrands(): Promise<Brand[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("getAllBrands error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getHeroSlides error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getSubcategories(): Promise<SubCategory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getSubcategories error:", error.message);
    return [];
  }
  return data ?? [];
}

/** Groups a flat subcategory list into { [categoryKey]: SubCategory[] } for nav rendering. */
export function groupSubcategoriesByCategory(subcategories: SubCategory[]): Record<string, SubCategory[]> {
  return subcategories.reduce<Record<string, SubCategory[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});
}
