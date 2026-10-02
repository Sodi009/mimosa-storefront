const TRACKING_API_URL = process.env.NEXT_PUBLIC_TRACKING_API_URL;

export default function AdminOrdersPage() {
  if (!TRACKING_API_URL) {
    return (
      <div>
        <div className="admin-page-head">
          <h1>Orders</h1>
        </div>
        <p className="admin-empty">
          Order tracking isn't configured yet (missing NEXT_PUBLIC_TRACKING_API_URL).
        </p>
      </div>
    );
  }

  const adminUrl = `${TRACKING_API_URL}?admin=1`;
  const riderUrl = `${TRACKING_API_URL}?mode=deli`;

  return (
    <div>
      <div className="admin-page-head">
        <h1>Orders</h1>
      </div>
      <p className="admin-section-hint">
        Order management lives in your Google Sheet's own admin pages — these links open
        them directly.
      </p>
      <div className="admin-orders-links">
        <a href={adminUrl} target="_blank" rel="noopener noreferrer" className="admin-orders-card">
          <h2>Order Management &amp; Insights</h2>
          <p>View every order, update status, batch-confirm, and see revenue/sales charts.</p>
          <span className="admin-orders-card-cta">Open ↗</span>
        </a>
        <a href={riderUrl} target="_blank" rel="noopener noreferrer" className="admin-orders-card">
          <h2>Rider / Delivery App</h2>
          <p>Mobile-friendly view for marking orders out-for-delivery and delivered.</p>
          <span className="admin-orders-card-cta">Open ↗</span>
        </a>
      </div>
    </div>
  );
}
