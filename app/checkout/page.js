"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppCheckoutUrl } from "@/lib/whatsapp";

function formatMoney(amount, currencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(amount);
}

export default function CheckoutPage() {
  const { lines, subtotal, currencyCode } = useCart();
  const [type, setType] = useState("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [building, setBuilding] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [landmark, setLandmark] = useState("");
  const [error, setError] = useState(null);

  if (lines.length === 0) {
    return (
      <main className="wrap checkout-page">
        <div className="section-head" style={{ paddingBottom: 8 }}>
          <h2>Checkout</h2>
        </div>
        <p style={{ color: "var(--muted)" }}>Your bag is empty.</p>
        <Link href="/collections/all" className="btn-primary" style={{ marginTop: 16 }}>
          Continue shopping
        </Link>
      </main>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (type === "delivery" && (!area.trim() || !building.trim() || !street.trim())) {
      setError("Please fill in your area, building/villa, and street for delivery.");
      return;
    }

    const fulfillment =
      type === "pickup"
        ? { type, name: name.trim(), phone: phone.trim() }
        : {
            type,
            name: name.trim(),
            phone: phone.trim(),
            area: area.trim(),
            building: building.trim(),
            street: street.trim(),
            apartment: apartment.trim(),
            landmark: landmark.trim(),
          };

    const url = getWhatsAppCheckoutUrl(lines, subtotal, currencyCode, fulfillment);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="wrap checkout-page">
      <div className="section-head" style={{ paddingBottom: 8 }}>
        <h2>Checkout</h2>
      </div>
      <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 28, maxWidth: "46ch" }}>
        Choose pickup or delivery, then send your order on WhatsApp — we'll confirm
        availability before you pay.
      </p>

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="option-group">
            <p className="option-label">Fulfillment</p>
            <div className="fulfillment-toggle">
              <button
                type="button"
                className={`fulfillment-option ${type === "delivery" ? "selected" : ""}`}
                onClick={() => setType("delivery")}
              >
                Delivery
              </button>
              <button
                type="button"
                className={`fulfillment-option ${type === "pickup" ? "selected" : ""}`}
                onClick={() => setType("pickup")}
              >
                Pickup
              </button>
            </div>
          </div>

          <label className="checkout-field">
            <span className="option-label">Full name</span>
            <input
              type="text"
              className="track-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>

          <label className="checkout-field">
            <span className="option-label">Phone number</span>
            <input
              type="tel"
              className="track-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 971 50 123 4567"
            />
          </label>

          {type === "delivery" && (
            <>
              <label className="checkout-field">
                <span className="option-label">Area / community in Dubai</span>
                <input
                  type="text"
                  className="track-input"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Dubai Marina, JBR, Business Bay"
                />
              </label>

              <label className="checkout-field">
                <span className="option-label">Building / villa name &amp; no.</span>
                <input
                  type="text"
                  className="track-input"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="e.g. Marina Heights Tower, Villa 12"
                />
              </label>

              <label className="checkout-field">
                <span className="option-label">Street</span>
                <input
                  type="text"
                  className="track-input"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street / zone"
                />
              </label>

              <label className="checkout-field">
                <span className="option-label">Apartment / floor / unit (optional)</span>
                <input
                  type="text"
                  className="track-input"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="e.g. Apt 1204, 12th floor"
                />
              </label>

              <label className="checkout-field">
                <span className="option-label">Nearest landmark (optional)</span>
                <input
                  type="text"
                  className="track-input"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Marina Mall"
                />
              </label>
            </>
          )}

          {error && <p className="track-error">{error}</p>}

          <button type="submit" className="checkout-btn" style={{ marginTop: 8 }}>
            Send order on WhatsApp
          </button>
        </form>

        <div className="checkout-summary">
          <p className="option-label" style={{ marginBottom: 12 }}>
            Order summary
          </p>
          {lines.map((line) => (
            <div className="track-item-row" key={line.variantId}>
              <span>
                {line.productTitle}
                {line.variantTitle && line.variantTitle !== "Default Title" ? ` (${line.variantTitle})` : ""}
                {" "}
                x{line.quantity}
              </span>
              <span>{formatMoney(line.price * line.quantity, line.currencyCode)}</span>
            </div>
          ))}
          <div className="track-item-row track-item-total">
            <span>Total</span>
            <span>{formatMoney(subtotal, currencyCode)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
