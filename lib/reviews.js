// Submits and fetches customer reviews from the same Google Sheet backend
// used for order tracking (action: "addReview" / "getReviews" on the Apps Script).

const TRACKING_API_URL = process.env.NEXT_PUBLIC_TRACKING_API_URL;

export async function submitReview({ name, rating, text }) {
  if (!TRACKING_API_URL) {
    return { success: false, error: "Reviews aren't configured yet." };
  }
  try {
    const res = await fetch(TRACKING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "addReview", name, rating, text }),
    });
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("submitReview failed:", err);
    return { success: false, error: err.message };
  }
}

export async function getReviews() {
  if (!TRACKING_API_URL) return [];
  try {
    const res = await fetch(`${TRACKING_API_URL}?action=getReviews`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.reviews) ? data.reviews : [];
  } catch (err) {
    console.error("getReviews failed:", err);
    return [];
  }
}
