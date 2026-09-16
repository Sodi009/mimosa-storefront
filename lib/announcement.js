// Pulls the site-wide announcement (e.g. delivery time) from the "Settings"
// tab (cell A1) in the same Google Sheet used for orders/reviews.

const TRACKING_API_URL = process.env.NEXT_PUBLIC_TRACKING_API_URL;

export async function getAnnouncement() {
  if (!TRACKING_API_URL) return "";
  try {
    const res = await fetch(`${TRACKING_API_URL}?action=getAnnouncement`, { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();
    return typeof data.message === "string" ? data.message.trim() : "";
  } catch (err) {
    console.error("getAnnouncement failed:", err);
    return "";
  }
}
