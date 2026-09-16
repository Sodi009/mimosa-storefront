// Per-product minimum order quantities, enforced in our own cart/checkout
// since this site doesn't use Shopify's native checkout (so Shopify order-limit
// apps have no effect here). Counts any mix of that product's variants toward
// the minimum — e.g. 1x Size 36/Style 2 + 1x Size 40/Style 5 satisfies a
// minimum of 2 for that product.
export const MINIMUM_QUANTITY_RULES = {
  "soft-bra-thai-brand": 2,
};

export function getMinimumQuantity(handle) {
  return MINIMUM_QUANTITY_RULES[handle] || 1;
}

// Returns a list of { handle, productTitle, required, have } for any product
// in the cart that hasn't met its minimum quantity yet.
export function findUnmetMinimums(lines) {
  const totals = {};
  lines.forEach((line) => {
    if (!totals[line.handle]) {
      totals[line.handle] = { productTitle: line.productTitle, quantity: 0 };
    }
    totals[line.handle].quantity += line.quantity;
  });

  return Object.entries(totals)
    .map(([handle, { productTitle, quantity }]) => ({
      handle,
      productTitle,
      required: getMinimumQuantity(handle),
      have: quantity,
    }))
    .filter((entry) => entry.have < entry.required);
}
