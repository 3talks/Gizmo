import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import ScrollChrome from "@/components/ScrollChrome";
import { getSubcategories, groupSubcategoriesByCategory } from "@/lib/data";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const subcategories = await getSubcategories();
  const subcategoriesByCategory = groupSubcategoriesByCategory(subcategories);

  return (
    <div className="mx-auto max-w-[1360px]">
      <ScrollChrome />
      <Header subcategoriesByCategory={subcategoriesByCategory} />
      <main>{children}</main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <WishlistDrawer />
      <SearchOverlay />
    </div>
  );
}
