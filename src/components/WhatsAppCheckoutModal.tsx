import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { useCart, formatPrice } from "@/lib/store";
import { waOrder } from "@/lib/whatsapp";

export function WhatsAppCheckoutModal({ open, onClose, shipping }: { open: boolean; onClose: () => void; shipping: number }) {
  const { detailed, subtotal, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });

  if (!open) return null;
  const total = subtotal + shipping;
  const valid = form.name.trim() && form.phone.trim() && form.address.trim() && form.city.trim() && detailed.length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const url = waOrder(
      detailed.map((d) => ({ name: d.product.name, qty: d.qty, price: d.product.price })),
      form,
      total,
    );
    window.open(url, "_blank");
    clear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-5">
          <h3 className="text-lg font-extrabold text-navy">Complete your order</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="space-y-3 p-5">
          {(["name", "phone", "address", "city"] as const).map((k) => (
            <div key={k}>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {k === "name" ? "Full Name" : k === "phone" ? "Phone Number" : k === "address" ? "Full Address" : "City"}
              </label>
              <input
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-gold"
                required
              />
            </div>
          ))}
          <div className="rounded-lg bg-secondary p-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="mt-1 flex justify-between border-t pt-1 font-bold text-navy"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <button type="submit" disabled={!valid} className="flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-3 text-sm font-bold text-white transition hover:bg-whatsapp-dark disabled:opacity-50">
            <MessageCircle className="h-4 w-4" /> Send Order on WhatsApp
          </button>
          <p className="text-center text-xs text-muted-foreground">Payment: Cash on Delivery 💵</p>
        </form>
      </div>
    </div>
  );
}
