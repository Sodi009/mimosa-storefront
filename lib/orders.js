// Submits a checkout order straight into the Google Sheet the Admin panel reads from,
// using the same doPost endpoint added to the existing Apps Script (action: "addOrder").
// This never blocks checkout — if the sheet write fails, the customer still gets to WhatsApp.

const TRACKING_API_URL = process.env.NEXT_PUBLIC_TRACKING_API_URL;

export async function submitOrderToSheet(order) {
  if (!TRACKING_API_URL) {
    return { success: false, error: "Tracking isn't configured." };
  }

  try {
    const res = await fetch(TRACKING_API_URL, {
      method: "POST",
      // text/plain avoids a CORS preflight against Apps Script, which doesn't handle OPTIONS.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "addOrder", ...order }),
    });
    if (!res.ok) throw new Error(`Sheet responded with ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("submitOrderToSheet failed:", err);
    return { success: false, error: err.message };
  }
}
