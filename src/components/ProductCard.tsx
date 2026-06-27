import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/products";
import { BEST_SELLER_IDS, NEW_IDS } from "@/lib/products";
import { useCart, useWishlist, formatPrice } from "@/lib/store";
import { waProduct } from "@/lib/whatsapp";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const isBest = BEST_SELLER_IDS.has(product.id);
  const isNew = NEW_IDS.has(product.id);
  const lowStock = product.stock > 0 && product.stock < 5;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {isBest && <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-navy">★ BEST SELLER</span>}
        {isNew && <span className="rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>}
        {lowStock && <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-white">Only {product.stock} left!</span>}
        {product.stock === 0 && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">Out of stock</span>}
      </div>
      <button
        aria-label="Wishlist"
        onClick={() => { toggle(product.id); toast(wished ? "Removed from wishlist" : "Added to wishlist ❤️"); }}
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur shadow transition hover:scale-110"
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-destructive text-destructive" : "text-navy"}`} />
      </button>

      <Link to="/products/$id" params={{ id: product.id }} className="block aspect-square overflow-hidden bg-white">
        <ProductImage src={product.image} alt={product.name} className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{product.brand}</div>
          <Link to="/products/$id" params={{ id: product.id }} className="line-clamp-2 text-sm font-semibold text-navy hover:text-gold">
            {product.name}
          </Link>
        </div>
        <div className="text-lg font-extrabold text-navy">{formatPrice(product.price)}</div>
        <div className="mt-auto flex flex-col gap-2">
          <button
            disabled={product.stock === 0}
            onClick={() => { add(product.id); toast.success("Added to cart 🛒"); }}
            className="flex items-center justify-center gap-2 rounded-lg bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-navy-light disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </button>
          <a
            href={waProduct(product)}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-3 py-2 text-xs font-bold text-white transition hover:bg-whatsapp-dark"
          >
            <MessageCircle className="h-4 w-4" /> Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
