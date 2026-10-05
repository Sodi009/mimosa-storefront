import { getProducts, getProductsByCategory, getInStockProducts, CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import CategoryFilterMenu from "@/components/CategoryFilterMenu";

const FILTER_CATEGORIES = [
  { name: "All", handle: "all" },
  { name: "New In", handle: "new" },
  { name: "Instock items", handle: "instock" },
  { name: "Bags", handle: "bags" },
  { name: "Tops", handle: "tops" },
  { name: "Dresses", handle: "dresses" },
  { name: "Bottoms", handle: "bottoms" },
  { name: "Innerwears", handle: "innerwear" },
  { name: "Shoes", handle: "shoes" },
  { name: "Accessories", handle: "accessories" },
  { name: "Supplements", handle: "supplements" },
  { name: "Beauty & Cosmetic", handle: "beauty-cosmetics" },
  { name: "Hair Tools", handle: "hair-tools" },
  { name: "Foods", handle: "foods" },
  { name: "Contact Lens and Glasses", handle: "contact-lens-glasses" },
  { name: "Sisterhood", handle: "sisterhood" },
  { name: "Wallet", handle: "wallet" },
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
  } else if (handle === "instock") {
    title = "Instock items";
    products = await getInStockProducts({ first: 48 });
  } else if (CATEGORIES.includes(handle)) {
    title = FILTER_CATEGORIES.find((cat) => cat.handle === handle)?.name
      || handle.charAt(0).toUpperCase() + handle.slice(1);
    products = await getProductsByCategory(handle);
  } else {
    return (
      <main className="wrap">
        <p style={{ padding: "80px 0" }}>Collection not found.</p>
      </main>
    );
  }

  return (
    <main className="wrap">
      <div className="section-head">
        <h2>{title}</h2>
      </div>
      <CategoryFilterMenu categories={FILTER_CATEGORIES} current={handle} />
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
