"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function BottomNav() {
  const pathname = usePathname();
  const { totalQuantity, openCart } = useCart();
  const count = totalQuantity || 0;

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/collections") || pathname.startsWith("/products");
  const isTrack = pathname.startsWith("/track");

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <Link href="/" className={`bottom-nav-item ${isHome ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
        </svg>
        <span>Home</span>
      </Link>

      <Link href="/collections/all" className={`bottom-nav-item ${isShop ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="7" height="7" rx="1.2" />
          <rect x="13" y="4" width="7" height="7" rx="1.2" />
          <rect x="4" y="13" width="7" height="7" rx="1.2" />
          <rect x="13" y="13" width="7" height="7" rx="1.2" />
        </svg>
        <span>Shop</span>
      </Link>

      <button type="button" className="bottom-nav-item bottom-nav-cart" onClick={openCart} aria-label="Open cart">
        <span className="bottom-nav-cart-icon-wrap">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8h12l-1 12H7L6 8z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          {count > 0 && <span className="bottom-nav-cart-badge">{count}</span>}
        </span>
        <span>Bag</span>
      </button>

      <Link href="/track" className={`bottom-nav-item ${isTrack ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7h13l4 4v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z" />
          <circle cx="7.5" cy="18.5" r="1.5" />
          <circle cx="16.5" cy="18.5" r="1.5" />
        </svg>
        <span>Track</span>
      </Link>
    </nav>
  );
}
