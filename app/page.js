import { getProducts } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  let products = [];
  let configError = null;

  try {
    products = await getProducts({ first: 8 });
  } catch (err) {
    configError = err.message;
  }

  return (
    <main className="wrap">
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">Mimosa BKK Collection</p>
          <h1>Your BKK wardrobe awaits in Dubai.</h1>
          <p>
            Curated finds sourced and packed in Bangkok, delivered straight to your door
            in Dubai. Add what you like to your bag, send your order on WhatsApp, and
            we'll confirm stock before you pay.
          </p>
          <a href="/collections/all" className="btn-primary">
            Shop the collection
          </a>
        </div>
        <div className="hero-image">
          <div className="hero-image-inner">
            {products[0]?.featuredImage && (
              <img src={products[0].featuredImage.url} alt={products[0].featuredImage.altText || ""} />
            )}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="how-step">
          <span className="how-step-num">01</span>
          <p className="how-step-title">Browse &amp; add to bag</p>
          <p className="how-step-desc">Pick what you like from the collection below.</p>
        </div>
        <div className="how-step">
          <span className="how-step-num">02</span>
          <p className="how-step-title">Send on WhatsApp</p>
          <p className="how-step-desc">Your bag becomes a message — just hit send.</p>
        </div>
        <div className="how-step">
          <span className="how-step-num">03</span>
          <p className="how-step-title">Confirm &amp; pay</p>
          <p className="how-step-desc">We confirm stock, then arrange bank transfer.</p>
        </div>
        <div className="how-step">
          <span className="how-step-num">04</span>
          <p className="how-step-title">Delivered in Dubai</p>
          <p className="how-step-desc">Track your order anytime on our tracking page.</p>
        </div>
      </section>

      <div className="section-head">
        <h2>New in</h2>
        <a href="/collections/all">View all</a>
      </div>

      {configError && (
        <p style={{ color: "var(--muted)", paddingBottom: 40 }}>
          Products will appear here once SHOPIFY_STORE_DOMAIN and
          SHOPIFY_STOREFRONT_ACCESS_TOKEN are set in .env.local. ({configError})
        </p>
      )}

      {!configError && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}