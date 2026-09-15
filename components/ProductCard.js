import Link from "next/link";

function formatPrice(amount, currencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

export default function ProductCard({ product }) {
  const price = product.priceRange?.minVariantPrice;
  return (
    <Link href={`/products/${product.handle}`} className="product-card">
      <div className="product-card-image">
        {product.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            loading="lazy"
          />
        )}
      </div>
      <div className="product-card-body">
        <p className="product-card-title">{product.title}</p>
        {product.availableForSale ? (
          <p className="product-card-price">
            {price ? formatPrice(price.amount, price.currencyCode) : ""}
          </p>
        ) : (
          <p className="sold-out-tag">Sold out</p>
        )}
      </div>
    </Link>
  );
}
