"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { cart, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const count = cart?.totalQuantity || 0;

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-lockup" onClick={() => setMenuOpen(false)}>
          <img src="/icon.jpg" alt="" className="brand-icon" />
          <span className="brand-text">
            <span className="brand-name">MIMOSA</span>
            <span className="brand-sub">BKK Collection</span>
          </span>
        </Link>
        <nav className={`header-nav ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)}>
          <Link href="/">Home</Link>
          <Link href="/collections/all">Shop</Link>
          <Link href="/collections/new">New In</Link>
          <Link href="/track">Track Order</Link>
        </nav>
        <div className="header-actions">
          <button className="cart-toggle" onClick={openCart}>
            Bag {count > 0 ? `(${count})` : ""}
          </button>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
