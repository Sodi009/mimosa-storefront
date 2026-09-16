"use client";

import { useEffect, useState } from "react";

const TRACKING_API_URL = process.env.NEXT_PUBLIC_TRACKING_API_URL;

const STAGES = ["Preparing", "Pickup", "Shipped Out", "Out For delivery", "Delivered"];
const STAGE_LABELS = {
  Preparing: "Order processed",
  Pickup: "Ready to pickup",
  "Shipped Out": "Shipped out",
  "Out For delivery": "Out for delivery",
  Delivered: "Delivered",
};

function currentStageFromStatus(status) {
  const low = (status || "").toLowerCase();
  if (low.includes("delivered")) return "Delivered";
  if (low.includes("out")) return "Out For delivery";
  if (low.includes("shipped")) return "Shipped Out";
  if (low.includes("pickup")) return "Pickup";
  if (low.includes("preparing") || low.includes("processed")) return "Preparing";
  return null;
}

function formatMoney(amount) {
  const n = parseFloat(amount);
  return isNaN(n) ? amount : n.toFixed(2);
}

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      if (!TRACKING_API_URL) {
        setError("Tracking isn't configured yet.");
        return;
      }
      const res = await fetch(
        `${TRACKING_API_URL}?action=track&q=${encodeURIComponent(query.trim())}`
      );
      if (!res.ok) {
        throw new Error(`Tracking server responded with ${res.status}`);
      }
      const data = await res.json();
      if (data.found) {
        setOrder(data);
      } else {
        setError("We couldn't find that order. Check the ID or name and try again.");
      }
    } catch (err) {
      console.error("Track order lookup failed:", err);
      setError("Something went wrong looking that up. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const status = order?.status || "";
  const statusLow = status.toLowerCase();
  const isCancelled = statusLow.includes("cancel");
  const isPending = statusLow.includes("pending");
  const isConfirmed = statusLow === "confirm" || statusLow === "confirmed";
  const showStepper = order && !isCancelled && !isPending;
  const activeStage = order ? currentStageFromStatus(status) : null;
  const activeIndex = activeStage ? STAGES.indexOf(activeStage) : -1;
  const isCOD = (order?.payment || "").toUpperCase().includes("COD") || (order?.payment || "").toUpperCase().includes("CASH");

  const itemNames = order?.item ? order.item.toString().split(", ") : [];
  const itemPrices = order?.price ? order.price.toString().split(", ") : [];

  function closeResult() {
    setOrder(null);
  }

  useEffect(() => {
    if (!order) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeResult();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [order]);

  return (
    <main className="wrap track-page">
      <div className="section-head" style={{ paddingBottom: 8 }}>
        <h2>Track your order</h2>
      </div>
      <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 28, maxWidth: "46ch" }}>
        Enter your order ID or the name you ordered under to see its current status.
      </p>

      <form onSubmit={handleSubmit} className="track-form">
        <input
          type="text"
          className="track-input"
          placeholder="Order ID or name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Searching…" : "Track order"}
        </button>
      </form>

      {error && <p className="track-error">{error}</p>}

      {order && (
        <div className="track-modal-overlay" onClick={closeResult}>
          <div className="track-modal" onClick={(e) => e.stopPropagation()}>
            <button className="track-modal-close" onClick={closeResult} aria-label="Close">
              ×
            </button>
            <div className="track-result">
              <div className="track-result-head">
                <div>
                  <p className="track-order-id">Order #{order.no}</p>
                  <p className="track-order-name">{order.name}</p>
                </div>
              </div>

              {isCancelled && (
                <div className="track-banner track-banner-cancel">
                  <strong>Order cancelled</strong>
                  <span>This order has been cancelled.</span>
                </div>
              )}

              {isPending && (
                <div className="track-banner track-banner-pending">
                  <strong>Please wait</strong>
                  <span>Your order is pending confirmation. Check back soon!</span>
                </div>
              )}

              {isConfirmed && (
                <div className="track-banner track-banner-confirmed">
                  <strong>Order confirmed</strong>
                  <span>Your order is confirmed! We'll prepare it soon.</span>
                </div>
              )}

              {activeStage === "Out For delivery" && (
                <div className="track-banner track-banner-out">
                  <strong>Out for delivery</strong>
                  <span>Courier is on the way.</span>
                  <a
                    href="https://wa.me/971504036705"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="track-wa-link"
                  >
                    Contact courier
                  </a>
                </div>
              )}

              {showStepper && (
                <>
                  <ul className="track-stepper">
                    {STAGES.map((stage, i) => (
                      <li
                        key={stage}
                        className={`track-step ${i <= activeIndex ? "active" : ""}`}
                      >
                        <span className="track-step-dot" />
                        <span className="track-step-label">{STAGE_LABELS[stage]}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="track-item-card">
                    {itemNames.map((name, i) => (
                      <div className="track-item-row" key={i}>
                        <span>{name.split(" (x")[0]}</span>
                        <span>{formatMoney(itemPrices[i] || 0)} AED</span>
                      </div>
                    ))}
                    <div className="track-item-row track-item-total">
                      <span>Total</span>
                      <span>{formatMoney(order.amount)} AED</span>
                    </div>
                    <div className="track-item-row track-item-payment">
                      <span>Payment</span>
                      <span className={isCOD ? "track-cod" : "track-paid"}>
                        {isCOD ? "COD" : "Paid"}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}