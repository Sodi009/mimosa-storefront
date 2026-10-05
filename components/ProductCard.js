import Link from "next/link";
import { formatApproxPriceRange } from "@/lib/price";

const NEW_WITHIN_DAYS = 14;

function isNew(createdAt) {
  if (!createdAt) return false;
  const ageMs = Date.now() - new Date(createdAt).getTime();
  return ageMs < NEW_WITHIN_DAYS * 24 * 60 * 60 * 1000;
}

export default function ProductCard({ product }) {
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
        {isNew(product.createdAt) && <span className="product-card-badge">New</span>}
      </div>
      <div className="product-card-body">
        <p className="product-card-title">{product.title}</p>
        {product.availableForSale ? (
          <p className="product-card-price">{formatApproxPriceRange(product.priceFrom, product.priceTo)}</p>
        ) : (
          <p className="sold-out-tag">Sold out</p>
        )}
      </div>
    </Link>
  );
}
