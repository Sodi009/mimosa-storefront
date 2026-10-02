"use client";

import { useMemo, useState, useTransition } from "react";
import { updateOrderStatusAction, deleteOrderAction } from "../../actions";

const STATUS_OPTIONS = [
  "Pending Confirmation",
  "Confirmed",
  "Preparing",
  "Pickup",
  "Shipped Out",
  "Out For delivery",
  "Delivered",
  "Cancelled",
];

function statusClass(status) {
  const low = status.toLowerCase();
  if (low.includes("cancel")) return "admin-status-cancelled";
  if (low.includes("delivered")) return "admin-status-delivered";
  if (low.includes("pending")) return "admin-status-pending";
  return "";
}

function OrderRow({ order }) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(order.status);

  function handleStatusChange(e) {
    const next = e.target.value;
    setStatus(next);
    const fd = new FormData();
    fd.set("orderNo", order.order_no);
    fd.set("status", next);
    startTransition(async () => {
      await updateOrderStatusAction(fd);
    });
  }

  function handleDelete() {
    if (!confirm(`Delete order ${order.order_no}? This can't be undone.`)) return;
    const fd = new FormData();
    fd.set("orderNo", order.order_no);
    startTransition(async () => {
      await deleteOrderAction(fd);
    });
  }

  const isCOD = order.payment.toUpperCase().includes("COD") || order.payment.toUpperCase().includes("CASH");

  return (
    <tr style={{ opacity: pending ? 0.5 : 1 }}>
      <td className="admin-table-muted">{order.order_no}</td>
      <td>{order.name}</td>
      <td style={{ maxWidth: 260 }}>
        <div style={{ fontSize: 12 }}>{order.items}</div>
        {order.address && (
          <div className="admin-table-muted" style={{ fontSize: 11, marginTop: 2 }}>
            {order.area ? `${order.area} — ` : ""}
            {order.address}
          </div>
        )}
      </td>
      <td>{Number(order.amount).toFixed(2)} AED</td>
      <td>
        <span className={isCOD ? "admin-payment-cod" : "admin-payment-paid"}>
          {isCOD ? "COD" : "PAID"}
        </span>
      </td>
      <td>
        <select
          className={`admin-status-select ${statusClass(status)}`}
          value={STATUS_OPTIONS.includes(status) ? status : ""}
          onChange={handleStatusChange}
          disabled={pending}
        >
          {!STATUS_OPTIONS.includes(status) && <option value="">{status}</option>}
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td>
        <button type="button" className="admin-delete-btn" onClick={handleDelete} disabled={pending}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function OrdersTable({ orders }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.order_no.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.items.toLowerCase().includes(q)
    );
  }, [orders, query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by order ID, name, or item…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="admin-orders-search"
      />
      <p className="admin-section-hint">{filtered.length} of {orders.length} orders</p>

      {filtered.length === 0 && <p className="admin-empty">No orders match that search.</p>}

      {filtered.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Name</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <OrderRow key={order.order_no} order={order} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
