import { formatPrice } from "./store";
import type { Product } from "./products";

export const WA_NUMBER = "923220066229";
export const WA_DISPLAY = "0322 0066229";

export function waLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function waGeneral() {
  return waLink("Hi! I want to know more about Ali Mobile Zone products 🛍️");
}

export function waProduct(p: Product, qty = 1) {
  const msg = `Hi Ali Mobile Zone! 👋

I want to order:
🛍️ Product: ${p.name}
💰 Price: ${formatPrice(p.price)}
📦 Quantity: ${qty}

Please confirm availability and delivery. Thank you!`;
  return waLink(msg);
}

export function waOrder(
  items: Array<{ name: string; qty: number; price: number }>,
  customer: { name: string; phone: string; address: string; city: string },
  total: number,
) {
  const lines = items.map((i) => `▪️ ${i.name} x ${i.qty} — ${formatPrice(i.price * i.qty)}`).join("\n");
  const msg = `Hi! New Order from Ali Mobile Zone 🛒
━━━━━━━━━━━━━━━━━━
🛒 ORDER DETAILS:
${lines}
━━━━━━━━━━━━━━━━━━
💰 Total: ${formatPrice(total)}

📍 CUSTOMER DETAILS:
Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}
City: ${customer.city}

Payment: Cash on Delivery 💵
Thank you! 🙏`;
  return waLink(msg);
}
