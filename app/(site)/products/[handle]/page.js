import { getProductByHandle, getRelatedProducts } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return (
      <main className="wrap">
        <p style={{ padding: "80px 0" }}>Product not found.</p>
      </main>
    );
  }

  const related = await getRelatedProducts(product.category, product.id);

  return (
    <main className="wrap">
      <div className="pdp">
        <ProductDetail product={product} />
      </div>

      {related.length > 0 && (
        <>
          <div className="section-head">
            <h2>You may also like</h2>
          </div>
          <div className="product-grid" style={{ marginBottom: 64 }}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
