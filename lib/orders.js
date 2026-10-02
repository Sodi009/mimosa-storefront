"use server";

// Creates and looks up orders directly in Supabase. These run as Server
// Actions, so the service-role key never reaches the browser — but they're
// intentionally open to anyone (no admin check), since customers placing a
// checkout order or looking up their order status aren't logged in. This
// matches the old Apps Script's addOrder/track actions, which were public
// in exactly the same way.

import { supabaseAdmin } from "./supabase-admin";

async function nextOrderNo() {
  const { data, error } = await supabaseAdmin.from("orders").select("order_no");
  if (error) throw new Error(error.message);

  let maxNum = 0;
  (data || []).forEach((row) => {
    const m = (row.order_no || "").match(/MBKK-(\d+)/i);
    if (m) maxNum = Math.max(maxNum, Number.parseInt(m[1], 10));
  });
  return `MBKK-${maxNum + 1}`;
}

// order: { name, item, price, qty, amount, payment, area, address, phone }
// (field names match the shape checkout/page.js and the admin order form
// already build, so neither needed to change when this moved off Sheets.)
export async function submitOrder(order) {
  try {
    const orderNo = await nextOrderNo();
    const { error } = await supabaseAdmin.from("orders").insert({
      order_no: orderNo,
      name: order.name || "",
      items: order.item || "",
      prices: String(order.price || ""),
      qty: Number(order.qty) || 0,
      amount: Number(order.amount) || 0,
      payment: order.payment || "",
      area: order.area || "",
      address: order.address || "",
      phone: order.phone || "",
      status: "Pending Confirmation",
    });
    if (error) throw new Error(error.message);
    return { success: true, no: orderNo };
  } catch (err) {
    console.error("submitOrder failed:", err);
    return { success: false, error: err.message };
  }
}

// Returns { found, no, name, item, price, amount, payment, status, area,
// address } to match what app/(site)/track/page.js already expects — same
// field names the old Apps Script's trackItem() returned.
export async function trackOrder(query) {
  const q = (query || "").trim();
  if (!q) return { found: false };

  try {
    // Two separate exact-match queries (not a single .or() filter string) so
    // a comma or other PostgREST-filter-syntax character in the search text
    // can never be misread as part of the query itself.
    const [byId, byName] = await Promise.all([
      supabaseAdmin.from("orders").select("*").ilike("order_no", q),
      supabaseAdmin.from("orders").select("*").ilike("name", q),
    ]);
    if (byId.error) throw new Error(byId.error.message);
    if (byName.error) throw new Error(byName.error.message);

    const data = [...(byId.data || []), ...(byName.data || [])];
    if (!data.length) return { found: false };

    // Newest first, same as the old system's "check newest orders first".
    data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const order = data[0];

    return {
      found: true,
      no: order.order_no,
      name: order.name,
      item: order.items,
      price: order.prices,
      qty: order.qty,
      amount: order.amount,
      payment: order.payment,
      status: order.status,
      area: order.area,
      address: order.address,
    };
  } catch (err) {
    console.error("trackOrder failed:", err);
    return { found: false };
  }
}
