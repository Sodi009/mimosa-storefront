import { getProducts } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = [
  {
    name: "Bags",
    handle: "bags",
    icon: (
      <path d="M6 8h12l1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Z M9 8V6a3 3 0 0 1 6 0v2" />
    ),
  },
  {
    name: "Clothes",
    handle: "clothes",
    icon: (
      <path d="M8 4 4 7l2 3 2-1v11h8V9l2 1 2-3-4-3-2 2h-2L8 4Z" />
    ),
  },
  {
    name: "Shoes",
    handle: "shoes",
    icon: (
      <path d="M3 16c0-1 1-2 2-2s1.5.5 2.5.5S9 13 10 12c1-1 2-1 3 0 1.5 1.5 3 2 5 2 1.5 0 3 1 3 3v1H3v-2Z" />
    ),
  },
  {
    name: "Accessories",
    handle: "accessories",
    icon: (
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    ),
  },
];

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

      <div className="section-head">
        <h2>Shop by category</h2>
      </div>
      <div className="category-grid">
        {CATEGORIES.map((cat) => (
          <a key={cat.handle} href={`/collections/${cat.handle}`} className="category-card">
            <svg
              className="category-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {cat.icon}
            </svg>
            <span className="category-name">{cat.name}</span>
          </a>
        ))}
      </div>

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