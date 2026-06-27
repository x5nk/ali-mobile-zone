import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, ShoppingCart, Minus, Plus, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { useCart, useProduct, useProducts, useWishlist, formatPrice } from "@/lib/store";
import { waProduct } from "@/lib/whatsapp";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const product = useProduct(id);
  const { products } = useProducts();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "ship">("desc");
  const [zoom, setZoom] = useState(false);

  if (!product) throw notFound();

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5);
  const wished = has(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-navy">Home</Link><ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-navy">Products</Link><ChevronRight className="h-3 w-3" />
        <span className="text-navy">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-[var(--shadow-card)]">
          <div className={`relative aspect-square cursor-zoom-in ${zoom ? "cursor-zoom-out" : ""}`} onClick={() => setZoom(!zoom)}>
            <ProductImage src={product.image} alt={product.name} className={`h-full w-full object-contain p-8 transition-transform duration-500 ${zoom ? "scale-150" : ""}`} />
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gold">{product.brand} · {product.category}</div>
          <h1 className="mt-2 text-3xl font-extrabold text-navy">{product.name}</h1>
          <div className="mt-2 flex items-center gap-1 text-gold text-sm">{"★★★★★"} <span className="ml-1 text-xs text-muted-foreground">(124 reviews)</span></div>
          <div className="mt-5 text-4xl font-extrabold text-navy">{formatPrice(product.price)}</div>
          <div className="mt-2 text-sm">
            {product.stock > 5 ? <span className="text-whatsapp-dark font-bold">✓ In Stock</span> : product.stock > 0 ? <span className="text-destructive font-bold">Only {product.stock} left!</span> : <span className="text-destructive font-bold">Out of Stock</span>}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="inline-flex items-center rounded-lg border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center hover:bg-secondary"><Minus className="h-4 w-4" /></button>
              <div className="w-12 text-center text-sm font-bold">{qty}</div>
              <button onClick={() => setQty(qty + 1)} className="grid h-10 w-10 place-items-center hover:bg-secondary"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={() => { toggle(product.id); toast(wished ? "Removed from wishlist" : "Added to wishlist ❤️"); }} className="grid h-10 w-10 place-items-center rounded-lg border hover:bg-secondary">
              <Heart className={`h-4 w-4 ${wished ? "fill-destructive text-destructive" : "text-navy"}`} />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button disabled={product.stock === 0} onClick={() => { add(product.id, qty); toast.success(`Added ${qty} to cart 🛒`); }} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white hover:bg-navy-light disabled:opacity-50">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
            <a href={waProduct(product, qty)} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-whatsapp px-5 py-3 text-sm font-bold text-white hover:bg-whatsapp-dark">
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </a>
          </div>

          <div className="mt-8 border-b">
            <div className="flex gap-4">
              {(["desc", "ship"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`pb-2 text-sm font-bold ${tab === t ? "border-b-2 border-gold text-navy" : "text-muted-foreground"}`}>
                  {t === "desc" ? "Description" : "Shipping & COD"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 text-sm leading-relaxed text-foreground/80">
            {tab === "desc" ? product.description : "Cash on Delivery available nationwide 🇵🇰. Free delivery on orders above Rs.2,000. Standard delivery: 2-4 working days."}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-extrabold text-navy">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
