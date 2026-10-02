// Per-product minimum order quantities, enforced in our own cart/checkout
// since this site doesn't use Shopify's native checkout. Each product sets
// its own minimum (or none) in the admin panel; a cart line carries that
// number as `minQuantity` so this file never needs per-product code changes.
// Counts any mix of that product's variants toward the minimum — e.g.
// 1x Size 36/Style 2 + 1x Size 40/Style 5 satisfies a minimum of 2.

// Returns a list of { handle, productTitle, required, have } for any product
// in the cart that hasn't met its minimum quantity yet.
export function findUnmetMinimums(lines) {
  const totals = {};
  lines.forEach((line) => {
    if (!totals[line.handle]) {
      totals[line.handle] = {
        productTitle: line.productTitle,
        quantity: 0,
        required: line.minQuantity || 1,
      };
    }
    totals[line.handle].quantity += line.quantity;
  });

  return Object.entries(totals)
    .map(([handle, { productTitle, quantity, required }]) => ({
      handle,
      productTitle,
      required,
      have: quantity,
    }))
    .filter((entry) => entry.have < entry.required);
}
