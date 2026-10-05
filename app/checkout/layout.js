import { CartProvider } from "@/lib/cart-context";
import CheckoutTopbar from "@/components/CheckoutTopbar";

// Checkout gets its own minimal layout — no header/footer/bottom nav, just
// a back button — so there's nothing pulling the customer off the page
// while they're placing an order.
export default function CheckoutLayout({ children }) {
  return (
    <CartProvider>
      <CheckoutTopbar />
      {children}
    </CartProvider>
  );
}
