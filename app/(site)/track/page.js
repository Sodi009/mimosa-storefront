"use client";

import { useEffect, useState } from "react";
import { trackOrder } from "@/lib/orders";

async function downloadInvoice(order) {
  const html2canvas = (await import("html2canvas")).default;

  const names = (order.item || "").split(", ").filter(Boolean);
  const prices = (order.price || "").toString().split(", ");
  const itemsHtml = names
    .map(
      (n, i) => `
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px;border-bottom:1px solid #f9f9f9;padding-bottom:5px;">
        <span>${n.split(" (x")[0]}</span>
        <span style="font-weight:600;">${(Number.parseFloat(prices[i]) || 0).toFixed(2)} AED</span>
      </div>`
    )
    .join("");

  const wrap = document.createElement("div");
  wrap.style.cssText =
    "position:fixed;left:-9999px;width:500px;background:#fff;padding:40px;color:#1a1a1a;border:1px solid #eee;font-family:sans-serif;";
  wrap.innerHTML = `
    <div style="text-align:center;margin-bottom:30px;">
      <img src="${window.location.origin}/icon.jpg" style="width:70px;height:70px;border-radius:50%;margin-bottom:10px;border:1px solid #eee;object-fit:cover;">
      <div style="font-size:22px;font-weight:800;letter-spacing:2px;">MIMOSA BKK</div>
      <div style="font-size:10px;color:#aaa;text-transform:uppercase;margin-top:4px;">Official Invoice</div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:20px;font-size:12px;color:#555;">
      <div><strong>Billed To:</strong><br>${order.name}</div>
      <div style="text-align:right;"><strong>Order ID:</strong> ${order.no}<br><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}</div>
    </div>
    <div style="margin-bottom:20px;">${itemsHtml}</div>
    <div style="background:#f9f9f9;padding:20px;border-radius:12px;">
      <div style="display:flex;justify-content:space-between;font-weight:800;font-size:18px;">
        <span>TOTAL</span><span>${(Number.parseFloat(order.amount) || 0).toFixed(2)} AED</span>
      </div>
      <div style="font-size:11px;color:#888;margin-top:5px;">Payment: ${order.payment}</div>
    </div>
    <div style="text-align:center;margin-top:40px;font-size:10px;color:#ccc;text-transform:uppercase;letter-spacing:1px;">Thank you for your order</div>
  `;

  document.body.appendChild(wrap);
  await new Promise((resolve) => setTimeout(resolve, 100));
  const canvas = await html2canvas(wrap, { useCORS: true, scale: 2 });
  wrap.remove();

  const link = document.createElement("a");
  link.download = `Invoice_Mimosa_${order.no}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

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
      const data = await trackOrder(query.trim());
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
                    href="https://wa.me/66629141307"
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

                  <button
                    type="button"
                    className="btn-invoice"
                    onClick={() => downloadInvoice(order)}
                  >
                    Download invoice
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}