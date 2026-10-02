// Per-product minimum order quantities, enforced in our own cart/checkout
// since this site doesn't use Shopify's native checkout. Each product sets
// its own minimum (or none) in the admin panel; a cart line carries that
// number as `minQuantity` so this file never needs per-product code changes.
//
// The minimum counts distinct sizes/styles, not total quantity — e.g. a
// minimum of 2 is satisfied by 1x Size 36 + 1x Size 40, but NOT by 2x of the
// same Size 36 (that's one choice, just bought twice).

// Returns a list of { handle, productTitle, required, have } for any product
// in the cart that hasn't met its minimum yet. `have` is the count of
// distinct variants (sizes/styles) chosen, not the total item quantity.
export function findUnmetMinimums(lines) {
  const totals = {};
  lines.forEach((line) => {
    if (!totals[line.handle]) {
      totals[line.handle] = {
        productTitle: line.productTitle,
        variantIds: new Set(),
        required: line.minQuantity || 1,
      };
    }
    totals[line.handle].variantIds.add(line.variantId);
  });

  return Object.entries(totals)
    .map(([handle, { productTitle, variantIds, required }]) => ({
      handle,
      productTitle,
      required,
      have: variantIds.size,
    }))
    .filter((entry) => entry.have < entry.required);
}
