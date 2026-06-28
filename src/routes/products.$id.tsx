import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart, MessageCircle, ShoppingCart, Minus, Plus, ChevronRight,
  Check, Truck, Package, ShieldCheck, RotateCcw, Star, Lock, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { useCart, useProduct, useProducts, useWishlist, formatPrice } from "@/lib/store";
import { waProduct } from "@/lib/whatsapp";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
});

// Rich detail overrides for specific products
const PRODUCT_DETAILS: Record<string, { description: string; features: string[] }> = {
  "r-615": {
    description: "The Ronin R-615 is a reliable Android wall charger built for everyday fast charging. Compact and travel-friendly, it delivers stable output to keep your devices powered efficiently without overheating.",
    features: [
      "Micro-USB (Android) connector",
      "Compact travel-friendly design",
      "Stable output for safe efficient charging",
      "Compatible with all Android smartphones & tablets",
      "Overcharge protection built-in",
    ],
  },
  "r-1515": {
    description: "The Ronin R-1515 is a flagship over-ear wireless headphone with Active Noise Cancellation and premium 40mm drivers. Whether at a busy office or home, it delivers a professional-grade listening experience with up to 30 hours battery.",
    features: [
      "Active Noise Cancellation (ANC)",
      "Premium 40mm drivers for studio-quality sound",
      "Bluetooth 5.0 with multipoint pairing",
      "Transparency mode",
      "AI noise reduction mic for crystal-clear calls",
      "Up to 30 hours battery with ANC on",
      "Luxurious padded over-ear design",
    ],
  },
  "anker-r50i": {
    description: "The Anker Soundcore R50i delivers wireless freedom with Bluetooth 5.3, IPX5 water resistance, and clear calls powered by AI noise reduction. Compatible with both iPhone and Android.",
    features: [
      "Bluetooth 5.3 for stable connection",
      "10-hour battery + 30 hours with charging case",
      "IPX5 water resistance",
      "AI noise reduction for crystal-clear calls",
      "Compatible with iPhone & Android",
    ],
  },
  "airpods-4": {
    description: "Apple AirPods 4 feature the H2 chip with Personalized Spatial Audio, dynamic head tracking, and Voice Isolation. Comes with a USB-C charging case. Available with or without Active Noise Cancellation.",
    features: [
      "Apple H2 chip",
      "Personalized Spatial Audio with dynamic head tracking",
      "Voice Isolation for clear calls",
      "USB-C charging case",
      "Available: Without ANC / With ANC variants",
    ],
  },
  "r-09-luxe": {
    description: "The Ronin R-09 Luxe is a premium wireless earbud with a luxurious finish, deep bass, and long battery life. Designed for those who demand both style and performance.",
    features: [
      "Premium Luxe finish",
      "Deep bass sound profile",
      "Long battery life",
      "Bluetooth 5.0",
      "Comfortable in-ear fit",
      "Touch controls",
    ],
  },
  "r-6065": {
    description: "The Ronin R-6065 is a high-wattage fast charger built for modern smartphones. Supports fast charging protocols and comes with built-in safety protections.",
    features: [
      "High-wattage fast charging",
      "Universal USB compatibility",
      "Built-in overcharge & overheat protection",
      "Compact design",
      "Compatible with Android & iOS",
    ],
  },
  "r-2505": {
    description: "The Ronin R-2505 is a dual-port car charger that keeps your devices powered on every journey. Plug into any car socket for fast, reliable in-car charging.",
    features: [
      "Dual USB ports",
      "Fast car charging",
      "Compatible with all smartphones",
      "Compact plug-and-play design",
      "Safe voltage regulation",
    ],
  },
  "audionic-850": {
    description: "The Audionic Trance Airbud 850 is a premium TWS earbud delivering rich sound, deep bass, and long playtime. Engineered for music lovers who want immersive audio in a sleek wireless package.",
    features: [
      "True Wireless Stereo (TWS)",
      "Deep bass with rich audio profile",
      "Long battery playtime",
      "Touch controls",
      "Bluetooth 5.0",
      "Includes charging case",
    ],
  },
  "r-09-ultra": {
    description: "The Ronin R-09 Ultra is the top-tier version of the R-09 series, delivering ultra-refined sound with enhanced ANC and a premium build. For the audiophile who settles for nothing less.",
    features: [
      "Ultra-grade Active Noise Cancellation",
      "Enhanced sound drivers",
      "Bluetooth 5.0 multipoint",
      "Premium build & finish",
      "Long battery life",
      "In-line touch controls",
    ],
  },
  "r-010-silicon": {
    description: "The Ronin R-010 Silicon features a comfortable silicone earbud design with a secure fit for workouts and daily use. Combines durability with crisp clear audio.",
    features: [
      "Soft silicone ear tips for secure fit",
      "Clear audio with punchy bass",
      "Sweat-resistant design",
      "Bluetooth wireless",
      "Touch controls",
      "Compact charging case",
    ],
  },
};

function ProductDetail() {
  const { id } = Route.useParams();
  const product = useProduct(id);
  const { products } = useProducts();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [qty, setQty] = useState(1);

  if (!product) throw notFound();

  const detail = PRODUCT_DETAILS[product.id];
  const longDesc = detail?.description ?? product.description;
  const features = detail?.features ?? [
    "100% original & genuine product",
    "Reliable everyday performance",
    "Quality tested before shipping",
    "Compatible with leading smartphones",
  ];

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const wished = has(product.id);

  const originalPrice = Math.round(product.price / 0.9);
  const savings = originalPrice - product.price;

  return (
    <div className="bg-gradient-to-b from-secondary/40 to-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-navy">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-navy">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 text-navy">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
          {/* LEFT — Image */}
          <div>
            <div className="group relative overflow-hidden rounded-2xl border bg-white shadow-[var(--shadow-card)]">
              <span className="absolute left-4 top-4 z-10 rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-navy shadow">
                10% OFF
              </span>
              <button
                onClick={() => { toggle(product.id); toast(wished ? "Removed from wishlist" : "Added to wishlist ❤️"); }}
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow backdrop-blur transition hover:scale-110"
                aria-label="Wishlist"
              >
                <Heart className={`h-4 w-4 ${wished ? "fill-destructive text-destructive" : "text-navy"}`} />
              </button>
              <div className="aspect-square overflow-hidden">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
            {/* Thumbnail strip (single image) */}
            <div className="mt-3 flex gap-2">
              <div className="h-20 w-20 overflow-hidden rounded-lg border-2 border-gold bg-white">
                <ProductImage src={product.image} alt={product.name} className="h-full w-full object-contain p-2" />
              </div>
            </div>
          </div>

          {/* RIGHT — Info */}
          <div>
            <span className="inline-block rounded-full bg-navy/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy">
              {product.brand}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-navy md:text-4xl">{product.name}</h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-gold text-gold" />)}
                <Star className="h-4 w-4 fill-gold/50 text-gold" />
              </div>
              <span className="text-sm font-medium text-navy">4.5/5</span>
              <span className="text-xs text-muted-foreground">(124 reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-extrabold text-navy">{formatPrice(product.price)}</span>
              <span className="text-lg text-muted-foreground line-through">{formatPrice(originalPrice)}</span>
              <span className="rounded-md bg-whatsapp/15 px-2 py-0.5 text-xs font-bold text-whatsapp-dark">
                10% OFF · Save {formatPrice(savings)}
              </span>
            </div>
            <div className="mt-1 text-sm">
              {product.stock > 5
                ? <span className="font-bold text-whatsapp-dark">✓ In Stock — Ready to ship</span>
                : product.stock > 0
                  ? <span className="font-bold text-destructive">Hurry! Only {product.stock} left</span>
                  : <span className="font-bold text-destructive">Out of Stock</span>}
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-relaxed text-foreground/80">{longDesc}</p>

            {/* Features */}
            <div className="mt-5">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-navy">Key Features</h3>
              <ul className="space-y-1.5">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-whatsapp/15 text-whatsapp-dark">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery badges */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              {[
                { icon: Truck, text: "Deliver in 2 Days — Nationwide" },
                { icon: Package, text: "Cash on Delivery Available" },
                { icon: ShieldCheck, text: "100% Original & Genuine" },
                { icon: RotateCcw, text: "7-Day Easy Returns" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-whatsapp/8 border border-whatsapp/20 px-3 py-2 text-xs font-medium text-navy">
                  <b.icon className="h-4 w-4 shrink-0 text-whatsapp-dark" />
                  <span>{b.text}</span>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-bold text-navy">Quantity:</span>
              <div className="inline-flex items-center rounded-lg border bg-white">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center hover:bg-secondary">
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-12 text-center text-sm font-bold">{qty}</div>
                <button onClick={() => setQty(qty + 1)} className="grid h-10 w-10 place-items-center hover:bg-secondary">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                disabled={product.stock === 0}
                onClick={() => { add(product.id, qty); toast.success(`Added ${qty} to cart 🛒`); }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-whatsapp px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-whatsapp-dark hover:scale-[1.02] disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>
              <a
                href={waProduct(product, qty)}
                target="_blank" rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-navy-light hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" /> Order on WhatsApp
              </a>
            </div>

            {/* Guarantee strip */}
            <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border bg-white p-4 sm:grid-cols-4">
              {[
                { icon: Lock, label: "Secure Payment" },
                { icon: Zap, label: "Fast Delivery" },
                { icon: ShieldCheck, label: "Original Products" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map((g, i) => (
                <div key={i} className="flex flex-col items-center gap-1 text-center">
                  <g.icon className="h-5 w-5 text-gold" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-navy">{g.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-extrabold text-navy">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
