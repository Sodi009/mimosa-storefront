import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { getAnnouncement } from "@/lib/announcement";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata = {
  title: "Mimosa BKK",
  description: "Mimosa BKK Collection — considered pieces, made to last.",
};

export default async function RootLayout({ children }) {
  const announcement = await getAnnouncement();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <AnnouncementBar message={announcement} />
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
