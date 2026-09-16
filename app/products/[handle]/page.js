import { getProductByHandle } from "@/lib/shopify";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";

function formatMoney(amount, currencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

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

  const images = product.images.edges.map((e) => e.node);
  const price = product.priceRange.minVariantPrice;

  return (
    <main className="wrap">
      <div className="pdp">
        <ProductGallery images={images} title={product.title} />

        <div className="pdp-info">
          <h1>{product.title}</h1>
          <p className="pdp-price">{formatMoney(price.amount, price.currencyCode)}</p>
          {product.description && <p className="pdp-description">{product.description}</p>}
          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}
