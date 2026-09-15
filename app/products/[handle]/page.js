import { getProductByHandle } from "@/lib/shopify";
import AddToCartButton from "@/components/AddToCartButton";

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
        <div>
          <div className="pdp-gallery-main">
            {images[0] && <img src={images[0].url} alt={images[0].altText || product.title} />}
          </div>
          {images.length > 1 && (
            <div className="pdp-thumbs">
              {images.slice(1).map((img) => (
                <img key={img.url} src={img.url} alt={img.altText || ""} />
              ))}
            </div>
          )}
        </div>

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
