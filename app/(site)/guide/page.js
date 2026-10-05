export const metadata = {
  title: "How to shop with us — Mimosa BKK",
};

export default function GuidePage() {
  return (
    <main className="wrap">
      <div className="section-head" style={{ paddingBottom: 8 }}>
        <h2>How to shop with us</h2>
      </div>
      <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 8, maxWidth: "60ch" }}>
        A quick guide to browsing, ordering, and tracking on Mimosa BKK Collection.
      </p>

      <section className="how-it-works">
        <div className="how-step">
          <span className="how-step-num">01</span>
          <p className="how-step-title">Browse &amp; add to cart</p>
          <p className="how-step-desc">Pick what you like, choose a size/style, and add it to your cart.</p>
        </div>
        <div className="how-step">
          <span className="how-step-num">02</span>
          <p className="how-step-title">Send on WhatsApp</p>
          <p className="how-step-desc">Checkout turns your cart into a message — just hit send.</p>
        </div>
        <div className="how-step">
          <span className="how-step-num">03</span>
          <p className="how-step-title">Confirm &amp; pay</p>
          <p className="how-step-desc">We confirm stock and the exact price, then arrange payment.</p>
        </div>
        <div className="how-step">
          <span className="how-step-num">04</span>
          <p className="how-step-title">Delivered in Dubai</p>
          <p className="how-step-desc">Track your order anytime on the Track page.</p>
        </div>
      </section>

      <div className="guide-faq">
        <div className="guide-faq-item">
          <p className="option-label" style={{ marginBottom: 6 }}>Sizes &amp; minimum order</p>
          <p className="guide-faq-text">
            Some products need a minimum number of <em>different</em> sizes or styles per order —
            it's shown on the product page when it applies. Buying two of the exact same size
            doesn't count toward that minimum.
          </p>
        </div>

        <div className="guide-faq-item">
          <p className="option-label" style={{ marginBottom: 6 }}>Pricing</p>
          <p className="guide-faq-text">
            Product pages show a rough price range rather than one fixed number — the exact
            price for your order is confirmed with us on WhatsApp before you pay.
          </p>
        </div>

        <div className="guide-faq-item">
          <p className="option-label" style={{ marginBottom: 6 }}>Payment</p>
          <p className="guide-faq-text">
            Choose cash on delivery or bank transfer at checkout. Either way, we confirm your
            order on WhatsApp first — nothing is charged automatically.
          </p>
        </div>

        <div className="guide-faq-item">
          <p className="option-label" style={{ marginBottom: 6 }}>Delivery &amp; pickup</p>
          <p className="guide-faq-text">
            At checkout, choose delivery (fill in your area and address in Dubai) or pickup.
            Estimated processing and delivery time is shown in the banner at the top of the site.
          </p>
        </div>

        <div className="guide-faq-item">
          <p className="option-label" style={{ marginBottom: 6 }}>Tracking your order</p>
          <p className="guide-faq-text">
            Use the Track tab to look up your order by order ID or name, see its current status,
            and download an invoice once it's confirmed.
          </p>
        </div>

        <div className="guide-faq-item">
          <p className="option-label" style={{ marginBottom: 6 }}>Need help?</p>
          <p className="guide-faq-text">
            Message us on WhatsApp any time — the link is on the checkout page, or you can reach
            us directly from an order confirmation.
          </p>
        </div>
      </div>
    </main>
  );
}
