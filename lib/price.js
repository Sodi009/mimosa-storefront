export function formatPrice(amount, currencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

// Shows "AED 150.00" when every variant is the same price, or
// "AED 100.00 – 150.00" when prices vary across variants — currency shown
// once, up front, so it doesn't read like two different currencies.
export function formatPriceRange(min, max) {
  if (!min) return "";
  if (!max || min.amount === max.amount) {
    return formatPrice(min.amount, min.currencyCode);
  }
  const fmt = (n) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  return `${min.currencyCode} ${fmt(min.amount)} – ${fmt(max.amount)}`;
}
