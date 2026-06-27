import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart, formatPrice } from "@/lib/store";
import { ProductImage } from "@/components/ProductImage";
import { WhatsAppCheckoutModal } from "@/components/WhatsAppCheckoutModal";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Ali Mobile Zone" }] }),
  component: CartPage,
});

function CartPage() {
  const { detailed, subtotal, setQty, remove } = useCart();
  const [open, setOpen] = useState(false);
  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  if (detailed.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-secondary"><ShoppingBag className="h-10 w-10 text-navy" /></div>
        <h1 className="text-2xl font-extrabold text-navy">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Discover our products and start shopping.</p>
        <Link to="/products" className="mt-6 inline-block rounded-lg bg-navy px-6 py-3 text-sm font-bold text-white hover:bg-navy-light">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-navy">Shopping Cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{detailed.length} item{detailed.length > 1 ? "s" : ""} in your cart</p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {detailed.map((it) => (
            <div key={it.id} className="flex gap-4 rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)]">
              <Link to="/products/$id" params={{ id: it.product.id }} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white">
                <ProductImage src={it.product.image} alt={it.product.name} className="h-full w-full object-contain p-2" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{it.product.brand}</div>
                <Link to="/products/$id" params={{ id: it.product.id }} className="text-sm font-bold text-navy hover:text-gold line-clamp-2">{it.product.name}</Link>
                <div className="mt-1 text-sm font-extrabold text-navy">{formatPrice(it.product.price)}</div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border">
                    <button onClick={() => setQty(it.id, it.qty - 1)} className="grid h-8 w-8 place-items-center hover:bg-secondary"><Minus className="h-3 w-3" /></button>
                    <div className="w-10 text-center text-sm font-bold">{it.qty}</div>
                    <button onClick={() => setQty(it.id, it.qty + 1)} className="grid h-8 w-8 place-items-center hover:bg-secondary"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => remove(it.id)} className="grid h-8 w-8 place-items-center rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
          <Link to="/products" className="inline-block text-sm font-bold text-navy hover:text-gold">← Continue Shopping</Link>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] md:sticky md:top-24">
          <h3 className="text-lg font-extrabold text-navy">Order Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-bold">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-bold">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            {subtotal < 2000 && <div className="text-xs text-muted-foreground">Add {formatPrice(2000 - subtotal)} more for free delivery 🚚</div>}
            <div className="mt-2 flex justify-between border-t pt-3 text-base"><span className="font-bold text-navy">Total</span><span className="font-extrabold text-navy">{formatPrice(total)}</span></div>
          </div>
          <button onClick={() => setOpen(true)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-3 text-sm font-extrabold text-white hover:bg-whatsapp-dark">
            <MessageCircle className="h-4 w-4" /> Order via WhatsApp 💬
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Cash on Delivery · Nationwide 🇵🇰</p>
        </aside>
      </div>

      <WhatsAppCheckoutModal open={open} onClose={() => setOpen(false)} shipping={shipping} />
    </div>
  );
}
