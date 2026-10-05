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
  { name: "Sister Hood Bras", handle: "sister-hood-bras" },
  { name: "Wallet", handle: "wallet" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default async function CollectionPage({ params, searchParams }) {
  const { handle } = await params;
  const sp = await searchParams;
  const sort = SORT_OPTIONS.some((o) => o.value === sp?.sort) ? sp.sort : "newest";
  const instockOnly = sp?.instock === "1";

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

  if (instockOnly) {
    products = products.filter((p) => p.availableForSale);
  }

  if (sort === "price-asc" || sort === "price-desc") {
    const dir = sort === "price-asc" ? 1 : -1;
    products = [...products].sort(
      (a, b) => dir * (Number(a.priceFrom?.amount ?? 0) - Number(b.priceFrom?.amount ?? 0))
    );
  }

  function filterUrl({ sort: sortOverride, instock: instockOverride } = {}) {
    const nextSort = sortOverride !== undefined ? sortOverride : sort;
    const nextInstock = instockOverride !== undefined ? instockOverride : instockOnly;
    const qs = new URLSearchParams();
    if (nextSort !== "newest") qs.set("sort", nextSort);
    if (nextInstock) qs.set("instock", "1");
    const query = qs.toString();
    return query ? `/collections/${handle}?${query}` : `/collections/${handle}`;
  }

  return (
    <main className="wrap">
      <div className="section-head">
        <h2>{title}</h2>
      </div>
      <CategoryFilterMenu categories={FILTER_CATEGORIES} current={handle} />
      <div className="category-filter" style={{ paddingBottom: 24 }}>
        {SORT_OPTIONS.map((opt) => (
          <a
            key={opt.value}
            href={filterUrl({ sort: opt.value })}
            className={`category-filter-pill ${sort === opt.value ? "selected" : ""}`}
          >
            {opt.label}
          </a>
        ))}
        <a
          href={filterUrl({ instock: !instockOnly })}
          className={`category-filter-pill ${instockOnly ? "selected" : ""}`}
        >
          In stock only
        </a>
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
