import { Suspense } from "react";
import { CartProvider } from "@/lib/cart-context";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import BottomNav from "@/components/BottomNav";

export default function SiteLayout({ children }) {
  return (
    <CartProvider>
      {/* Streams in once the announcement fetch resolves, instead of
          blocking every page on a slow Google Apps Script response. */}
      <Suspense fallback={null}>
        <AnnouncementBar />
      </Suspense>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
      <BottomNav />
    </CartProvider>
  );
}
