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
          <h1>Considered pieces, made to last.</h1>
          <p>
            Sourced and packed in Bangkok, shipped with care. Browse the collection, add
            what you like to your bag, and send us your order on WhatsApp — we'll confirm
            and arrange payment from there.
          </p>
          <a href="/collections/all" className="btn-primary">
            Shop the collection
          </a>
        </div>
        <div className="hero-image">
          {products[0]?.featuredImage && (
            <img src={products[0].featuredImage.url} alt={products[0].featuredImage.altText || ""} />
          )}
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
