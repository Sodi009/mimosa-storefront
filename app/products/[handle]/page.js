import { getProductByHandle } from "@/lib/shopify";
import ProductDetail from "@/components/ProductDetail";

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

  return (
    <main className="wrap">
      <div className="pdp">
        <ProductDetail product={product} />
      </div>
    </main>
  );
}
