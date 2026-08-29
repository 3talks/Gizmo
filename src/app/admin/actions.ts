"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProductTag } from "@/lib/types";

type ActionResult = { error?: string } | void;

/**
 * Every write action below re-checks the session itself (not just relying
 * on middleware) and Supabase Row Level Security enforces it again at the
 * database layer — two independent layers, both server-side.
 */
async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

/* ---------------------------- auth ---------------------------- */

export async function signInAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");

  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Public sign-up is disabled for this app (see README), so there's no
    // user-enumeration risk in showing the real reason here — and it saves
    // a lot of guesswork versus a generic "incorrect credentials" message.
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        error:
          "This account's email isn't confirmed yet. In Supabase, go to Authentication → Users, and either resend/confirm it there, or recreate the user with \"Auto Confirm User\" checked.",
      };
    }
    return { error: error.message };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* -------------------------- products -------------------------- */

export interface ProductInput {
  id?: string;
  name: string;
  category: string;
  image_url: string | null;
  price: number;
  old_price: number | null;
  rating: number;
  reviews: number;
  tag: ProductTag;
  brand: string | null;
  tile: string;
}

export async function upsertProductAction(input: ProductInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  if (!input.name.trim() || !input.category || !input.price) {
    return { error: "Name, category and price are required." };
  }
  if (input.image_url?.startsWith("blob:")) {
    return { error: "That photo is still uploading — wait for it to finish before saving." };
  }

  const payload = {
    name: input.name.trim(),
    category: input.category,
    image_url: input.image_url,
    price: input.price,
    old_price: input.old_price,
    rating: input.rating,
    reviews: input.reviews,
    tag: input.tag,
    brand: input.brand,
    tile: input.tile,
  };

  const { error } = input.id
    ? await supabase.from("products").update(payload).eq("id", input.id)
    : await supabase.from("products").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return {};
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return {};
}

/* --------------------------- brands ----------------------------- */

export async function addBrandAction(name: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const trimmed = name.trim();
  if (!trimmed) return { error: "Enter a brand name." };

  const { error } = await supabase.from("brands").insert({ name: trimmed });
  if (error) {
    if (error.code === "23505") return { error: "That brand already exists." };
    return { error: error.message };
  }
  revalidatePath("/", "layout");
  return {};
}

export async function deleteBrandAction(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return {};
}

/* ------------------------ hero slides ---------------------------- */

export interface HeroSlideInput {
  id?: string;
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
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export async function upsertHeroSlideAction(input: HeroSlideInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  if (!input.title_line1.trim()) {
    return { error: "The slide needs at least a first title line." };
  }
  if (!input.href.trim().startsWith("/")) {
    return { error: "Link should be an internal path starting with /, e.g. /category/phone" };
  }
  if (input.image_url?.startsWith("blob:")) {
    return { error: "That photo is still uploading — wait for it to finish before saving." };
  }
  // Fallback colors are optional now (only used if a slide has no photo),
  // but if they were somehow set to something invalid, still catch it.
  if (input.color_from && !HEX_RE.test(input.color_from)) {
    return { error: "Colors must be valid hex codes, e.g. #3355FF." };
  }
  if (input.color_to && !HEX_RE.test(input.color_to)) {
    return { error: "Colors must be valid hex codes, e.g. #3355FF." };
  }
  if (input.color_via && !HEX_RE.test(input.color_via)) {
    return { error: "The middle color must be a valid hex code, e.g. #7D5CFF." };
  }

  const payload = {
    tag: input.tag.trim(),
    title_line1: input.title_line1.trim(),
    title_line2: input.title_line2.trim(),
    subtitle: input.subtitle.trim(),
    href: input.href.trim(),
    image_url: input.image_url,
    color_from: input.color_from,
    color_via: input.color_via,
    color_to: input.color_to,
    sort_order: input.sort_order,
  };

  const { error } = input.id
    ? await supabase.from("hero_slides").update(payload).eq("id", input.id)
    : await supabase.from("hero_slides").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return {};
}

export async function deleteHeroSlideAction(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return {};
}
