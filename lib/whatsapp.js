// Formats the cart into a readable order message and opens WhatsApp with it prefilled.
// The customer still has to hit "send" in WhatsApp — nothing is submitted automatically.

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "66629141307";

function formatMoney(amount, currencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(amount);
}

export function buildOrderMessage(lines, subtotal, currencyCode) {
  const itemLines = lines
    .map((l, i) => {
      const variantPart = l.variantTitle && l.variantTitle !== "Default Title" ? ` (${l.variantTitle})` : "";
      return `${i + 1}. ${l.productTitle}${variantPart} — x${l.quantity} — ${formatMoney(
        l.price * l.quantity,
        l.currencyCode
      )}`;
    })
    .join("\n");

  return [
    "Hi Mimosa BKK, I'd like to order:",
    "",
    itemLines,
    "",
    `Total: ${formatMoney(subtotal, currencyCode)}`,
    "",
    "Please confirm availability — I'll send bank transfer once confirmed.",
  ].join("\n");
}

export function getWhatsAppCheckoutUrl(lines, subtotal, currencyCode) {
  const message = buildOrderMessage(lines, subtotal, currencyCode);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
