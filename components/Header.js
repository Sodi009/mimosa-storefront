"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { totalQuantity, openCart, lastAdded } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const count = totalQuantity || 0;

  useEffect(() => {
    if (!lastAdded) return;
    setShowBadge(true);
    const t = setTimeout(() => setShowBadge(false), 1400);
    return () => clearTimeout(t);
  }, [lastAdded]);

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
          <div className="header-social-group">
            <a
              href="https://www.facebook.com/people/Mimosa-BKK-Collection/61571651470942/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mimosa BKK on Facebook"
              className="header-social"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.53 17.52 2.04 12 2.04S2 6.53 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34v7.03c4.78-.79 8.44-4.94 8.44-9.94z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@mimosa1872"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mimosa BKK on TikTok"
              className="header-social"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M16.5 2h-3.2v13.6a2.9 2.9 0 1 1-2.06-2.78v-3.3a6.2 6.2 0 1 0 5.26 6.13V9.1a7.9 7.9 0 0 0 4.5 1.4V7.3a4.6 4.6 0 0 1-4.5-4.6V2Z" />
              </svg>
            </a>
          </div>
          <div className="cart-toggle-wrap">
            <button className="cart-toggle" onClick={openCart} aria-label="Open cart">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
                <path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" />
              </svg>
            </button>
            {count > 0 && <span className="cart-count-badge">{count}</span>}
            {showBadge && lastAdded && (
              <span className="cart-add-badge">+{lastAdded.quantity}</span>
            )}
          </div>
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
