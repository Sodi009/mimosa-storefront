// Formats the cart into a readable order message and opens WhatsApp with it prefilled.
// The customer still has to hit "send" in WhatsApp — nothing is submitted automatically.

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "66629141307";

function fulfillmentLines(fulfillment) {
  if (!fulfillment) return [];

  const lines =
    fulfillment.type === "pickup"
      ? ["Fulfillment: Pickup", `Name: ${fulfillment.name}`, `Phone: ${fulfillment.phone}`]
      : [
          "Fulfillment: Delivery",
          `Name: ${fulfillment.name}`,
          `Phone: ${fulfillment.phone}`,
          `Area: ${fulfillment.area}`,
          `Building/Villa: ${fulfillment.building}`,
          `Street: ${fulfillment.street}`,
          ...(fulfillment.apartment ? [`Apartment/Floor/Unit: ${fulfillment.apartment}`] : []),
          ...(fulfillment.landmark ? [`Nearest landmark: ${fulfillment.landmark}`] : []),
        ];

  if (fulfillment.payment) {
    lines.push(`Payment: ${fulfillment.payment === "cod" ? "Cash on delivery" : "Bank transfer"}`);
  }

  return lines;
}

export function buildOrderMessage(lines, fulfillment) {
  const itemLines = lines
    .map((l, i) => {
      const variantPart = l.variantTitle && l.variantTitle !== "Default Title" ? ` (${l.variantTitle})` : "";
      return `${i + 1}. ${l.productTitle}${variantPart} — x${l.quantity}`;
    })
    .join("\n");

  const message = [
    "Hi Mimosa BKK, I'd like to order:",
    "",
    itemLines,
    "",
    "Price: to be confirmed",
  ];

  if (fulfillment?.orderId) {
    message.push("", `Order ID: ${fulfillment.orderId}`);
  }

  const fLines = fulfillmentLines(fulfillment);
  if (fLines.length > 0) {
    message.push("", ...fLines);
  }

  const closing =
    fulfillment?.payment === "cod"
      ? "Please confirm availability — I'll pay cash on delivery."
      : "Please confirm availability — I'll send bank transfer once confirmed.";
  message.push("", closing);

  return message.join("\n");
}

export function getWhatsAppCheckoutUrl(lines, fulfillment) {
  const message = buildOrderMessage(lines, fulfillment);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
