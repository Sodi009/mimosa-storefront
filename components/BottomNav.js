"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

// Hides the pill while the page scrolls down (more room to browse), and
// brings it back the moment the page scrolls up — the way most native
// app tab bars behave. Always visible near the very top so it doesn't
// vanish the instant someone starts reading.
function useHideOnScrollDown() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const diff = y - lastY.current;
      if (y < 40) {
        setHidden(false);
      } else if (diff > 4) {
        setHidden(true);
      } else if (diff < -4) {
        setHidden(false);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { totalQuantity, openCart } = useCart();
  const count = totalQuantity || 0;
  const hidden = useHideOnScrollDown();

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/collections") || pathname.startsWith("/products");
  const isTrack = pathname.startsWith("/track");
  const isGuide = pathname.startsWith("/guide");

  return (
    <nav className={`bottom-nav ${hidden ? "bottom-nav-hidden" : ""}`} aria-label="Primary">
      <Link href="/" className={`bottom-nav-item ${isHome ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
        </svg>
        <span>Home</span>
      </Link>

      <Link href="/collections/all" className={`bottom-nav-item ${isShop ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="7" height="7" rx="1.2" />
          <rect x="13" y="4" width="7" height="7" rx="1.2" />
          <rect x="4" y="13" width="7" height="7" rx="1.2" />
          <rect x="13" y="13" width="7" height="7" rx="1.2" />
        </svg>
        <span>Shop</span>
      </Link>

      <button type="button" className="bottom-nav-item bottom-nav-cart" onClick={openCart} aria-label="Open cart">
        <span className="bottom-nav-cart-icon-wrap">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
            <path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" />
          </svg>
          {count > 0 && <span className="bottom-nav-cart-badge">{count}</span>}
        </span>
        <span>Cart</span>
      </button>

      <Link href="/track" className={`bottom-nav-item ${isTrack ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7h13l4 4v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z" />
          <circle cx="7.5" cy="18.5" r="1.5" />
          <circle cx="16.5" cy="18.5" r="1.5" />
        </svg>
        <span>Track</span>
      </Link>

      <Link href="/guide" className={`bottom-nav-item ${isGuide ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.3 9.2a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 1.8-2.6 3.6" />
          <path d="M12 17v.01" />
        </svg>
        <span>Guide</span>
      </Link>
    </nav>
  );
}
