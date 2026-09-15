"use client";

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

  if (!isOpen) return null;

  const checkoutUrl = getWhatsAppCheckoutUrl(lines, subtotal, currencyCode);

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      <div className="cart-drawer">
        <div className="cart-drawer-head">
          <h2>Your bag</h2>
          <button className="cart-close" onClick={closeCart} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className="cart-lines">
          {lines.length === 0 && <p className="cart-empty">Your bag is empty.</p>}
          {lines.map((line) => (
            <div className="cart-line" key={line.variantId}>
              <div className="cart-line-image">
                {line.image && <img src={line.image} alt={line.productTitle} />}
              </div>
              <div style={{ flex: 1 }}>
                <p className="cart-line-title">{line.productTitle}</p>
                {line.variantTitle && line.variantTitle !== "Default Title" && (
                  <p className="cart-line-variant">{line.variantTitle}</p>
                )}
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
                <button className="remove-line" onClick={() => removeItem(line.variantId)} style={{ marginTop: 8 }}>
                  Remove
                </button>
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
