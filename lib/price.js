export function formatPrice(amount, currencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

// Shows "AED 150.00" when every variant is the same price, or
// "150.00 – AED 200.00" when prices vary across variants.
export function formatPriceRange(min, max) {
  if (!min) return "";
  if (!max || min.amount === max.amount) {
    return formatPrice(min.amount, min.currencyCode);
  }
  const minFormatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(min.amount);
  return `${minFormatted} – ${formatPrice(max.amount, max.currencyCode)}`;
}
