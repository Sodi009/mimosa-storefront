"use client";

import { useMemo, useState, useTransition } from "react";
import { updateOrderStatusAction, deleteOrderAction, batchUpdateOrderStatusAction } from "../../actions";
import OrderForm from "./OrderForm";

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

const BATCH_STATUS_OPTIONS = ["Confirmed", "Cancelled", "Preparing", "Pickup", "Shipped Out", "Out For delivery", "Delivered"];

function isDelivered(status) {
  return (status || "").toLowerCase().includes("delivered");
}

function statusClass(status) {
  const low = (status || "").toLowerCase();
  if (low.includes("cancel")) return "admin-status-cancelled";
  if (low.includes("delivered")) return "admin-status-delivered";
  if (low.includes("pending")) return "admin-status-pending";
  return "";
}

function OrderRow({ order, selectable, selected, onToggleSelect, onEdit }) {
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
      {selectable && (
        <td>
          <input type="checkbox" checked={selected} onChange={() => onToggleSelect(order.order_no)} />
        </td>
      )}
      <td className="admin-table-muted">{order.order_no}</td>
      <td>{order.name}</td>
      <td style={{ maxWidth: 240 }}>
        <div style={{ fontSize: 12 }}>{order.items}</div>
        {order.address && (
          <div className="admin-table-muted" style={{ fontSize: 11, marginTop: 2 }}>
            {order.area ? `${order.area} — ` : ""}
            {order.address}
          </div>
        )}
        {order.phone && (
          <div className="admin-table-muted" style={{ fontSize: 11 }}>{order.phone}</div>
        )}
      </td>
      <td>{Number(order.amount).toFixed(2)} AED</td>
      <td>
        <span className={isCOD ? "admin-payment-cod" : "admin-payment-paid"}>{isCOD ? "COD" : "PAID"}</span>
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
      <td className="admin-table-actions">
        <button type="button" className="admin-link-btn" onClick={() => onEdit(order)} disabled={pending}>
          Edit
        </button>
        <button type="button" className="admin-delete-btn" onClick={handleDelete} disabled={pending}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function OrdersTable({ orders }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("management");
  const [selected, setSelected] = useState(() => new Set());
  const [editingOrder, setEditingOrder] = useState(null);
  const [batchStatus, setBatchStatus] = useState("Confirmed");
  const [batchPending, startBatchTransition] = useTransition();

  const tabOrders = useMemo(
    () => orders.filter((o) => (tab === "history" ? isDelivered(o.status) : !isDelivered(o.status))),
    [orders, tab]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tabOrders;
    return tabOrders.filter(
      (o) =>
        o.order_no.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.items.toLowerCase().includes(q)
    );
  }, [tabOrders, query]);

  const codTotal = useMemo(() => {
    if (tab !== "history") return 0;
    return tabOrders
      .filter((o) => o.payment.toUpperCase().includes("COD") || o.payment.toUpperCase().includes("CASH"))
      .reduce((sum, o) => sum + Number(o.amount), 0);
  }, [tabOrders, tab]);

  function toggleSelect(orderNo) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(orderNo)) next.delete(orderNo);
      else next.add(orderNo);
      return next;
    });
  }

  function toggleSelectAll(e) {
    if (e.target.checked) setSelected(new Set(filtered.map((o) => o.order_no)));
    else setSelected(new Set());
  }

  function runBatchUpdate() {
    const fd = new FormData();
    fd.set("orderNos", JSON.stringify(Array.from(selected)));
    fd.set("status", batchStatus);
    startBatchTransition(async () => {
      await batchUpdateOrderStatusAction(fd);
      setSelected(new Set());
    });
  }

  function handleEdit(order) {
    setEditingOrder(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFormDone() {
    setEditingOrder(null);
  }

  return (
    <div>
      <OrderForm editingOrder={editingOrder} onDone={handleFormDone} onCancelEdit={() => setEditingOrder(null)} />

      <div className="admin-order-tabs">
        <button
          type="button"
          className={`admin-tab-btn ${tab === "management" ? "active" : ""}`}
          onClick={() => { setTab("management"); setSelected(new Set()); }}
        >
          Management
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${tab === "history" ? "active" : ""}`}
          onClick={() => { setTab("history"); setSelected(new Set()); }}
        >
          History
        </button>
      </div>

      {tab === "history" && (
        <p className="admin-section-hint">Total COD collected in history: <strong>{codTotal.toFixed(2)} AED</strong></p>
      )}

      <input
        type="text"
        placeholder="Search by order ID, name, or item…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="admin-orders-search"
      />
      <p className="admin-section-hint">{filtered.length} of {tabOrders.length} orders</p>

      {filtered.length === 0 && <p className="admin-empty">No orders here.</p>}

      {filtered.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              {tab === "management" && (
                <th>
                  <input
                    type="checkbox"
                    checked={selected.size > 0 && selected.size === filtered.length}
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
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
              <OrderRow
                key={order.order_no}
                order={order}
                selectable={tab === "management"}
                selected={selected.has(order.order_no)}
                onToggleSelect={toggleSelect}
                onEdit={handleEdit}
              />
            ))}
          </tbody>
        </table>
      )}

      {selected.size > 0 && (
        <div className="admin-batch-bar">
          <span>{selected.size} selected</span>
          <select value={batchStatus} onChange={(e) => setBatchStatus(e.target.value)}>
            {BATCH_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="button" className="btn-primary" onClick={runBatchUpdate} disabled={batchPending}>
            {batchPending ? "Updating…" : "Update"}
          </button>
        </div>
      )}
    </div>
  );
}
