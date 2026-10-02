"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppCheckoutUrl } from "@/lib/whatsapp";
import { submitOrderToSheet } from "@/lib/orders";
import { findUnmetMinimums } from "@/lib/product-rules";

// Matches the exact list in the Admin panel's area dropdown, so orders placed on the
// website land in the same buckets the area/insights charts already group by.
const DUBAI_AREAS = [
  "Al Rigga",
  "Deira",
  "Bur Dubai",
  "Downtown",
  "Business Bay",
  "Dubai Marina",
  "JLT",
  "JBR",
  "Jumeirah",
  "Mirdif",
  "Al Quoz",
  "Karama",
  "Satwa",
  "Nad Al Sheba",
  "Silicon Oasis",
  "International City",
  "Discovery Gardens",
  "Sports City",
  "Motor City",
  "Other",
];

function formatMoney(amount, currencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(amount);
}

export default function CheckoutPage() {
  const { lines, subtotal, currencyCode } = useCart();
  const [type, setType] = useState("delivery");
  const [payment, setPayment] = useState("cod");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [building, setBuilding] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [landmark, setLandmark] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const unmetMinimums = findUnmetMinimums(lines);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const unmet = findUnmetMinimums(lines);
    if (unmet.length > 0) {
      const first = unmet[0];
      setError(
        `${first.productTitle} needs at least ${first.required} in your bag (any size/design) — you have ${first.have}.`
      );
      return;
    }

    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (type === "delivery" && (!area || !building.trim() || !street.trim())) {
      setError("Please fill in your area, building/villa, and street for delivery.");
      return;
    }

    // Open the tab synchronously, right on the click, before any async work —
    // otherwise browsers (Safari especially) silently block window.open() once
    // it happens after an await, since it's no longer tied to the user gesture.
    const whatsappWindow = window.open("", "_blank");

    setSubmitting(true);

    const fulfillment =
      type === "pickup"
        ? { type, payment, name: name.trim(), phone: phone.trim() }
        : {
            type,
            payment,
            name: name.trim(),
            phone: phone.trim(),
            area,
            building: building.trim(),
            street: street.trim(),
            apartment: apartment.trim(),
            landmark: landmark.trim(),
          };

    // Same item/price string shape the Admin panel's own order form saves
    // ("Name (xQty)" joined by ", ", unit prices joined the same way).
    const itemStr = lines
      .map((l) => {
        const variantPart = l.variantTitle && l.variantTitle !== "Default Title" ? ` - ${l.variantTitle}` : "";
        return `${l.productTitle}${variantPart} (x${l.quantity})`;
      })
      .join(", ");
    const priceStr = lines.map((l) => l.price).join(", ");
    const totalQty = lines.reduce((sum, l) => sum + l.quantity, 0);

    const addressLine =
      type === "pickup"
        ? `Pickup — Phone: ${fulfillment.phone}`
        : [building, street, apartment].filter(Boolean).join(", ") +
          (landmark ? ` (near ${landmark})` : "") +
          ` — Phone: ${fulfillment.phone}`;

    // Save to the sheet in the background — WhatsApp shouldn't wait on that
    // network round-trip, it can take a couple of seconds. The order still
    // gets saved either way; it just won't have its ID in the WhatsApp text.
    submitOrderToSheet({
      name: fulfillment.name,
      item: itemStr,
      price: priceStr,
      qty: totalQty,
      amount: subtotal.toFixed(2),
      payment: payment === "cod" ? "CASH ON DELIVERY" : "PAID ONLINE",
      area: type === "delivery" ? area : "",
      address: addressLine,
    }).catch((err) => console.error("Order save failed:", err));

    const url = getWhatsAppCheckoutUrl(lines, subtotal, currencyCode, fulfillment);
    setSubmitting(false);

    if (whatsappWindow) {
      whatsappWindow.location.href = url;
    } else {
      // Popup was blocked even for the synchronous open — fall back to
      // navigating the current tab so the order still reaches WhatsApp.
      window.location.href = url;
    }
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

          <div className="option-group">
            <p className="option-label">Payment</p>
            <div className="fulfillment-toggle">
              <button
                type="button"
                className={`fulfillment-option ${payment === "cod" ? "selected" : ""}`}
                onClick={() => setPayment("cod")}
              >
                Cash on delivery
              </button>
              <button
                type="button"
                className={`fulfillment-option ${payment === "bank" ? "selected" : ""}`}
                onClick={() => setPayment("bank")}
              >
                Bank transfer
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
                <span className="option-label">Area in Dubai</span>
                <select
                  className="track-input"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                >
                  <option value="">Select an area</option>
                  {DUBAI_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
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

          <button type="submit" className="checkout-btn" disabled={submitting} style={{ marginTop: 8 }}>
            {submitting ? "Sending…" : "Send order on WhatsApp"}
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
          {unmetMinimums.map((u) => (
            <p className="checkout-min-qty-notice" key={u.handle}>
              Add {u.required - u.have} more {u.productTitle} to reach the minimum of {u.required}.
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
