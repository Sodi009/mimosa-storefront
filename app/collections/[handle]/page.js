import { getCollectionByHandle, getProducts, getProductsByCategory, CATEGORY_KEYWORDS } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";

const FILTER_CATEGORIES = [
  { name: "All", handle: "all" },
  { name: "New In", handle: "new" },
  { name: "Bags", handle: "bags" },
  { name: "Clothes", handle: "clothes" },
  { name: "Shoes", handle: "shoes" },
  { name: "Accessories", handle: "accessories" },
];

export default async function CollectionPage({ params }) {
  const { handle } = await params;
  let title = handle;
  let products = [];

  if (handle === "all") {
    title = "All products";
    products = await getProducts({ first: 48 });
  } else if (handle === "new") {
    title = "New in";
    products = await getProducts({ first: 24 });
  } else if (CATEGORY_KEYWORDS[handle]) {
    title = handle.charAt(0).toUpperCase() + handle.slice(1);
    products = await getProductsByCategory(handle);
  } else {
    const collection = await getCollectionByHandle(handle, { first: 48 });
    if (!collection) {
      return (
        <main className="wrap">
          <p style={{ padding: "80px 0" }}>Collection not found.</p>
        </main>
      );
    }
    title = collection.title;
    products = collection.products.edges.map((e) => e.node);
  }

  return (
    <main className="wrap">
      <div className="section-head">
        <h2>{title}</h2>
      </div>
      <div className="category-filter">
        {FILTER_CATEGORIES.map((cat) => (
          <a
            key={cat.handle}
            href={`/collections/${cat.handle}`}
            className={`category-filter-pill ${handle === cat.handle ? "selected" : ""}`}
          >
            {cat.name}
          </a>
        ))}
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.length === 0 && (
          <p style={{ padding: "40px 24px", color: "var(--muted)" }}>No products here yet.</p>
        )}
      </div>
    </main>
  );
}
