import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import ScrollChrome from "@/components/ScrollChrome";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1360px]">
      <ScrollChrome />
      <Header />
      <main>{children}</main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <WishlistDrawer />
      <SearchOverlay />
    </div>
  );
}
