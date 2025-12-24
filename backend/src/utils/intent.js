export function detectIntent(message) {
  const m = message.toLowerCase();

  if (m.includes("stock")) return "STOCK";
  if (m.includes("rupture")) return "OUT_OF_STOCK";
  if (m.includes("produit")) return "PRODUCT_LIST";
  if (m.includes("bonjour")) return "HELLO";

  return "UNKNOWN";
}
