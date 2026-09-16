// Formats the cart into a readable order message and opens WhatsApp with it prefilled.
// The customer still has to hit "send" in WhatsApp — nothing is submitted automatically.

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "66629141307";

function formatMoney(amount, currencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(amount);
}

export function buildOrderMessage(lines, subtotal, currencyCode, fulfillment) {
  const itemLines = lines
    .map((l, i) => {
      const variantPart = l.variantTitle && l.variantTitle !== "Default Title" ? ` (${l.variantTitle})` : "";
      return `${i + 1}. ${l.productTitle}${variantPart} — x${l.quantity} — ${formatMoney(
        l.price * l.quantity,
        l.currencyCode
      )}`;
    })
    .join("\n");

  const message = [
    "Hi Mimosa BKK, I'd like to order:",
    "",
    itemLines,
    "",
    `Total: ${formatMoney(subtotal, currencyCode)}`,
  ];

  if (fulfillment) {
    message.push("");
    if (fulfillment.type === "pickup") {
      message.push(
        "Fulfillment: Pickup",
        `Name: ${fulfillment.name}`,
        `Phone: ${fulfillment.phone}`
      );
    } else if (fulfillment.type === "delivery") {
      message.push(
        "Fulfillment: Delivery",
        `Name: ${fulfillment.name}`,
        `Phone: ${fulfillment.phone}`,
        `Area: ${fulfillment.area}`,
        `Building/Villa: ${fulfillment.building}`,
        `Street: ${fulfillment.street}`
      );
      if (fulfillment.apartment) message.push(`Apartment/Floor/Unit: ${fulfillment.apartment}`);
      if (fulfillment.landmark) message.push(`Nearest landmark: ${fulfillment.landmark}`);
    }
  }

  message.push("", "Please confirm availability — I'll send bank transfer once confirmed.");

  return message.join("\n");
}

export function getWhatsAppCheckoutUrl(lines, subtotal, currencyCode, fulfillment) {
  const message = buildOrderMessage(lines, subtotal, currencyCode, fulfillment);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
