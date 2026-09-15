"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { cart, openCart } = useCart();
  const count = cart?.totalQuantity || 0;

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-mark">
          MIMOSA
        </Link>
        <nav className="header-nav">
          <Link href="/collections/all">Shop</Link>
          <Link href="/collections/new">New In</Link>
        </nav>
        <button className="cart-toggle" onClick={openCart}>
          Bag {count > 0 ? `(${count})` : ""}
        </button>
      </div>
    </header>
  );
}
