import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllProducts, getAllBrands, getHeroSlides } from "@/lib/data";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — OLIZ Admin" };

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already redirects unauthenticated
  // visitors, but this page checks again before rendering anything.
  if (!user) redirect("/admin/login");

  const [products, brands, heroSlides] = await Promise.all([getAllProducts(), getAllBrands(), getHeroSlides()]);

  return (
    <AdminDashboardClient
      products={products}
      brands={brands}
      heroSlides={heroSlides}
      userEmail={user.email ?? "admin"}
    />
  );
}
