"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppCheckoutUrl } from "@/lib/whatsapp";

function formatMoney(amount, currencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(amount);
}

export default function CartDrawer() {
  const { lines, isOpen, closeCart, updateQuantity, removeItem, subtotal, currencyCode } = useCart();

  const checkoutUrl = getWhatsAppCheckoutUrl(lines, subtotal, currencyCode);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  return (
    <>
      <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={closeCart} />
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-drawer-head">
          <h2>Your bag</h2>
          <button className="cart-close" onClick={closeCart} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className="cart-lines">
          {lines.length === 0 && (
            <div className="cart-empty">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h12l1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <p>Your bag is empty.</p>
              <a href="/collections/all" className="btn-secondary" onClick={closeCart}>
                Continue shopping
              </a>
            </div>
          )}
          {lines.map((line) => (
            <div className="cart-line" key={line.variantId}>
              <div className="cart-line-image">
                {line.image && <img src={line.image} alt={line.productTitle} />}
              </div>
              <div style={{ flex: 1 }}>
                <div className="cart-line-top">
                  <div>
                    <p className="cart-line-title">{line.productTitle}</p>
                    {line.variantTitle && line.variantTitle !== "Default Title" && (
                      <p className="cart-line-variant">{line.variantTitle}</p>
                    )}
                  </div>
                  <button
                    className="remove-line"
                    onClick={() => removeItem(line.variantId)}
                    aria-label="Remove item"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 6h12Z" />
                    </svg>
                  </button>
                </div>
                <div className="cart-line-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(line.variantId, line.quantity - 1)}>
                    −
                  </button>
                  <span>{line.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(line.variantId, line.quantity + 1)}>
                    +
                  </button>
                  <span style={{ marginLeft: "auto" }}>
                    {formatMoney(line.price * line.quantity, line.currencyCode)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {lines.length > 0 && (
          <div className="cart-drawer-foot">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal, currencyCode)}</span>
            </div>
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="checkout-btn"
            >
              Order via WhatsApp
            </a>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
              We'll confirm availability on WhatsApp, then send bank transfer details.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
