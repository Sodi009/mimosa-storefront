import { getProductByHandle } from "@/lib/shopify";
import { formatPriceRange } from "@/lib/price";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";

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
  const { minVariantPrice, maxVariantPrice } = product.priceRange;

  return (
    <main className="wrap">
      <div className="pdp">
        <ProductGallery images={images} title={product.title} />

        <div className="pdp-info">
          <h1>{product.title}</h1>
          <p className="pdp-price">{formatPriceRange(minVariantPrice, maxVariantPrice)}</p>
          {product.description && <p className="pdp-description">{product.description}</p>}
          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}
