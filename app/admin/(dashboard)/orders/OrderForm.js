"use client";

import { useEffect, useState, useTransition } from "react";
import { getNextOrderNo, saveOrderAction } from "../../actions";

const EMPTY_ROW = { name: "", qty: 1, price: "" };

function parseItems(order) {
  if (!order) return [{ ...EMPTY_ROW }];
  const names = (order.items || "").split(", ").filter(Boolean);
  const prices = (order.prices || "").split(", ");
  const rows = names.map((str, i) => {
    const m = str.match(/(.+) \(x(\d+)\)/);
    return {
      name: m ? m[1] : str,
      qty: m ? Number(m[2]) : 1,
      price: prices[i] || "",
    };
  });
  return rows.length ? rows : [{ ...EMPTY_ROW }];
}

export default function OrderForm({ editingOrder, onDone, onCancelEdit }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [orderNo, setOrderNo] = useState("MBKK-");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [payment, setPayment] = useState("CASH ON DELIVERY");
  const [rows, setRows] = useState([{ ...EMPTY_ROW }]);

  const isEditing = Boolean(editingOrder);

  useEffect(() => {
    if (editingOrder) {
      setOrderNo(editingOrder.order_no);
      setName(editingOrder.name);
      setAddress(editingOrder.address || "");
      setPhone(editingOrder.phone || "");
      setArea(editingOrder.area || "");
      setPayment(editingOrder.payment || "CASH ON DELIVERY");
      setRows(parseItems(editingOrder));
    } else {
      resetForNew();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingOrder]);

  async function resetForNew() {
    setName("");
    setAddress("");
    setPhone("");
    setArea("");
    setPayment("CASH ON DELIVERY");
    setRows([{ ...EMPTY_ROW }]);
    setOrderNo("MBKK-");
    try {
      const next = await getNextOrderNo();
      setOrderNo(next);
    } catch {
      // leave "MBKK-" — admin can type the ID manually
    }
  }

  function updateRow(i, field, value) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
  }

  function removeRow(i) {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  const total = rows.reduce((sum, r) => sum + (Number(r.qty) || 0) * (Number(r.price) || 0), 0);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!orderNo.trim() || orderNo.trim() === "MBKK-") {
      setError("Please enter a valid order ID.");
      return;
    }
    const validRows = rows.filter((r) => r.name.trim());
    if (!validRows.length) {
      setError("Add at least one item.");
      return;
    }

    const items = validRows.map((r) => `${r.name.trim()} (x${Number(r.qty) || 0})`).join(", ");
    const prices = validRows.map((r) => r.price).join(", ");
    const qty = validRows.reduce((sum, r) => sum + (Number(r.qty) || 0), 0);
    const amount = validRows.reduce((sum, r) => sum + (Number(r.qty) || 0) * (Number(r.price) || 0), 0);

    const fd = new FormData();
    fd.set("orderNo", orderNo.trim());
    fd.set("isNew", isEditing ? "0" : "1");
    fd.set("name", name);
    fd.set("items", items);
    fd.set("prices", prices);
    fd.set("qty", String(qty));
    fd.set("amount", amount.toFixed(2));
    fd.set("payment", payment);
    fd.set("area", area);
    fd.set("address", address);
    fd.set("phone", phone);

    startTransition(async () => {
      try {
        await saveOrderAction(fd);
        resetForNew();
        onDone?.();
      } catch (err) {
        setError(err.message || "Something went wrong saving this order.");
      }
    });
  }

  return (
    <form className="admin-order-form" onSubmit={handleSubmit}>
      <div className="admin-page-head" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, margin: 0 }}>{isEditing ? `Editing ${editingOrder.order_no}` : "Add order"}</h2>
        {isEditing && (
          <button type="button" className="btn-secondary" style={{ padding: "6px 16px", fontSize: 13 }} onClick={onCancelEdit}>
            Cancel edit
          </button>
        )}
      </div>

      {error && <p className="admin-login-error">{error}</p>}

      <div className="admin-order-form-grid">
        <label className="admin-field">
          <span>Order ID</span>
          <input value={orderNo} onChange={(e) => setOrderNo(e.target.value)} disabled={isEditing} required />
        </label>
        <label className="admin-field">
          <span>Customer name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div className="admin-field">
        <span>Items</span>
        {rows.map((row, i) => (
          <div className="admin-order-item-row" key={i}>
            <input
              placeholder="Item name"
              value={row.name}
              onChange={(e) => updateRow(i, "name", e.target.value)}
            />
            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={row.qty}
              onChange={(e) => updateRow(i, "qty", e.target.value)}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={row.price}
              onChange={(e) => updateRow(i, "price", e.target.value)}
            />
            <button type="button" onClick={() => removeRow(i)} disabled={rows.length === 1}>✕</button>
          </div>
        ))}
        <button type="button" className="btn-secondary" style={{ padding: "6px 16px", fontSize: 13, marginTop: 4 }} onClick={addRow}>
          + Add item
        </button>
      </div>

      <div className="admin-order-form-grid">
        <label className="admin-field">
          <span>Payment</span>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="CASH ON DELIVERY">Cash on delivery</option>
            <option value="PAID ONLINE">Paid online</option>
          </select>
        </label>
        <label className="admin-field">
          <span>Area (optional)</span>
          <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Al Rigga" />
        </label>
      </div>

      <div className="admin-order-form-grid">
        <label className="admin-field">
          <span>Delivery address</span>
          <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <label className="admin-field">
          <span>Phone number</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0501234567" />
        </label>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Saving…" : `${isEditing ? "Update" : "Save"} order (${total.toFixed(2)} AED)`}
        </button>
      </div>
    </form>
  );
}
