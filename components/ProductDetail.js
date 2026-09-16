"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPriceRange } from "@/lib/price";
import { getMinimumQuantity } from "@/lib/product-rules";
import ProductGallery from "./ProductGallery";

function variantMatchesSelection(variant, selected) {
  return variant.selectedOptions.every((opt) => selected[opt.name] === opt.value);
}

export default function ProductDetail({ product }) {
  const { addItem, openCart } = useCart();
  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);
  const hasRealOptions = product.options.some((o) => o.name !== "Title" && o.values.length > 1);
  const minimumQuantity = getMinimumQuantity(product.handle);

  const [selected, setSelected] = useState(() => {
    const initial = {};
    product.options.forEach((opt) => {
      initial[opt.name] = opt.values[0];
    });
    return initial;
  });

  const selectedVariant = useMemo(
    () => variants.find((v) => variantMatchesSelection(v, selected)),
    [variants, selected]
  );

  function isValueAvailable(optionName, value) {
    const candidate = { ...selected, [optionName]: value };
    const match = variants.find((v) => variantMatchesSelection(v, candidate));
    return match ? match.availableForSale : false;
  }

  function handleAdd() {
    if (!selectedVariant || !selectedVariant.availableForSale) return;
    addItem(
      {
        variantId: selectedVariant.id,
        productTitle: product.title,
        variantTitle: selectedVariant.title,
        price: parseFloat(selectedVariant.price.amount),
        currencyCode: selectedVariant.price.currencyCode,
        image: selectedVariant.image?.url || product.images.edges[0]?.node.url,
        handle: product.handle,
      },
      1
    );
    openCart();
  }

  return (
    <>
      <ProductGallery images={images} title={product.title} variantImageUrl={selectedVariant?.image?.url} />

      <div className="pdp-info">
        <h1>{product.title}</h1>
        <p className="pdp-price">
          {formatPriceRange(product.priceRange.minVariantPrice, product.priceRange.maxVariantPrice)}
        </p>
        {minimumQuantity > 1 && (
          <p className="pdp-min-qty">
            Minimum order: {minimumQuantity} items — mix any size or design.
          </p>
        )}
        {product.description && <p className="pdp-description">{product.description}</p>}

        {hasRealOptions &&
          product.options.map((opt) => (
            <div className="option-group" key={opt.id}>
              <p className="option-label">{opt.name}</p>
              <div className="option-values">
                {opt.values.map((value) => {
                  const available = isValueAvailable(opt.name, value);
                  return (
                    <button
                      key={value}
                      disabled={!available}
                      className={`option-pill ${selected[opt.name] === value ? "selected" : ""}`}
                      onClick={() => setSelected((prev) => ({ ...prev, [opt.name]: value }))}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

        <button
          className="btn-primary"
          onClick={handleAdd}
          disabled={!selectedVariant || !selectedVariant.availableForSale}
        >
          {selectedVariant?.availableForSale ? "Add to bag" : "Sold out"}
        </button>
      </div>
    </>
  );
}
