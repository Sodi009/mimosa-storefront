const GUIDE_IMG = "https://ehxbmedebnlcadonpksh.supabase.co/storage/v1/object/public/guide-images";

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

      <div className="guide-steps">
        <div className="guide-step-item">
          <span className="guide-step-num">1</span>
          <div>
            <p className="option-label" style={{ marginBottom: 6 }}>Browse &amp; pick your size/style</p>
            <p className="guide-faq-text">
              Open any product to see its photos, description, and the sizes/styles currently in
              stock. Tap one to select it, then set how many you want with the quantity stepper.
            </p>
            <img className="guide-step-img" src={`${GUIDE_IMG}/guide-1-browse.png`} alt="Product page with size/style options" />
          </div>
        </div>

        <div className="guide-step-item">
          <span className="guide-step-num">2</span>
          <div>
            <p className="option-label" style={{ marginBottom: 6 }}>Add it to your cart</p>
            <p className="guide-faq-text">
              Tap "Add to cart" — you'll see it fly into the cart icon. Add more items the same
              way; a few products need more than one different size/style before checkout, and
              that's called out right on the product page when it applies.
            </p>
            <img className="guide-step-img" src={`${GUIDE_IMG}/guide-2-addedtocart.png`} alt="Cart icon showing an item just added" />
          </div>
        </div>

        <div className="guide-step-item">
          <span className="guide-step-num">3</span>
          <div>
            <p className="option-label" style={{ marginBottom: 6 }}>Fill in checkout details</p>
            <p className="guide-faq-text">
              From the cart, go to checkout and choose delivery or pickup, cash on delivery or
              bank transfer, and your name and contact details.
            </p>
            <img className="guide-step-img" src={`${GUIDE_IMG}/guide-3-checkout.png`} alt="Checkout form with fulfillment and payment options" />
          </div>
        </div>

        <div className="guide-step-item">
          <span className="guide-step-num">4</span>
          <div>
            <p className="option-label" style={{ marginBottom: 6 }}>Send your order on WhatsApp</p>
            <p className="guide-faq-text">
              Checkout turns everything into a message and opens WhatsApp with it ready to go —
              you just hit send from there.
            </p>
            <img className="guide-step-img" src={`${GUIDE_IMG}/guide-5-whatsapp.png`} alt="Pre-filled order message open in WhatsApp" />
          </div>
        </div>

        <div className="guide-step-item">
          <span className="guide-step-num">5</span>
          <div>
            <p className="option-label" style={{ marginBottom: 6 }}>We confirm stock &amp; price</p>
            <p className="guide-faq-text">
              We reply on WhatsApp to confirm availability and the final price for your order
              before anything is paid.
            </p>
          </div>
        </div>

        <div className="guide-step-item">
          <span className="guide-step-num">6</span>
          <div>
            <p className="option-label" style={{ marginBottom: 6 }}>Pay &amp; receive your order</p>
            <p className="guide-faq-text">
              Pay the way you chose at checkout, then sit back — we'll get it to you by delivery
              in Dubai or ready for pickup.
            </p>
          </div>
        </div>
      </div>

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
          <img className="guide-step-img" src={`${GUIDE_IMG}/guide-4-track.png`} alt="Track order search page" />
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
