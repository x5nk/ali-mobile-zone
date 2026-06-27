import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Truck, ShieldCheck, Headphones, Plug, Smartphone, Apple, Package2, Zap } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, formatPrice } from "@/lib/store";
import { BEST_SELLER_IDS, NEW_IDS, CATEGORIES } from "@/lib/products";
import { waGeneral } from "@/lib/whatsapp";
import { HeroFx } from "@/components/HeroFx";
import { ShowcaseStrip } from "@/components/ShowcaseStrip";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ali Mobile Zone — Pakistan's #1 Mobile Accessories Store" },
      { name: "description", content: "Shop chargers, headphones, earbuds and more. 10% OFF, free delivery above Rs.2,000. Cash on Delivery nationwide." },
    ],
  }),
  component: HomePage,
});

const SLIDES = [
  { title: "Pakistan's #1 Mobile Accessories Store", sub: "Premium chargers, headphones & earbuds delivered to your door.", cta: "Shop Now", to: "/products" as const, accent: "Trusted by thousands" },
  { title: "10% OFF on All Products Today!", sub: "Limited-time savings across every category. Don't miss out.", cta: "View Deals", to: "/products" as const, accent: "Today only" },
  { title: "Free Delivery Above Rs.2,000", sub: "Order on WhatsApp — Cash on Delivery available nationwide.", cta: "Order on WhatsApp", to: null, accent: "Nationwide 🇵🇰" },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[i];
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-navy-light text-white">
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 20%, var(--gold) 0%, transparent 40%), radial-gradient(circle at 80% 80%, var(--gold) 0%, transparent 40%)" }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
        <div key={i} className="animate-fade-up">
          <div className="mb-3 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">{s.accent}</div>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">{s.title}</h1>
          <p className="mt-4 max-w-md text-base text-white/80">{s.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {s.to ? (
              <Link to={s.to} className="rounded-lg bg-gold px-6 py-3 text-sm font-bold text-navy transition hover:scale-105">{s.cta}</Link>
            ) : (
              <a href={waGeneral()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-6 py-3 text-sm font-bold text-white transition hover:bg-whatsapp-dark"><MessageCircle className="h-4 w-4" />{s.cta}</a>
            )}
            <Link to="/products" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">Browse all</Link>
          </div>
        </div>
        <div className="relative hidden md:block">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold/30 to-transparent blur-3xl" />
          <div className="relative grid grid-cols-2 gap-4">
            {[Smartphone, Headphones, Plug, Zap].map((Icon, idx) => (
              <div key={idx} className="aspect-square rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur" style={{ animation: `fade-up 0.6s ease-out ${idx * 0.1}s both` }}>
                <Icon className="h-full w-full text-gold" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-gold" : "w-2 bg-white/40"}`} aria-label={`Slide ${idx + 1}`} />
        ))}
      </div>
      <button onClick={() => setI((x) => (x - 1 + SLIDES.length) % SLIDES.length)} className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur hover:bg-white/20 md:block"><ChevronLeft className="h-5 w-5" /></button>
      <button onClick={() => setI((x) => (x + 1) % SLIDES.length)} className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur hover:bg-white/20 md:block"><ChevronRight className="h-5 w-5" /></button>
    </section>
  );
}

const CATEGORY_ICONS: Record<string, typeof Plug> = {
  Chargers: Plug, Headphones: Headphones, Earbuds: Headphones, "Ronin Products": Package2, "Apple Products": Apple, "Mobile Covers": Smartphone,
};

function CategoriesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-navy">Shop by Category</h2>
          <p className="mt-1 text-sm text-muted-foreground">Find exactly what you need</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c] ?? Package2;
          return (
            <Link key={c} to="/products" search={{ category: c } as never} className="group flex flex-col items-center gap-2 rounded-2xl border bg-card p-5 text-center shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-navy text-gold transition group-hover:bg-gold group-hover:text-navy"><Icon className="h-7 w-7" /></div>
              <div className="text-xs font-bold text-navy">{c}</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, target.getTime() - now);
  const h = Math.floor(diff / 3.6e6);
  const m = Math.floor((diff % 3.6e6) / 6e4);
  const s = Math.floor((diff % 6e4) / 1000);
  return { h, m, s };
}

function FlashSale() {
  const target = new Date(); target.setHours(23, 59, 59, 0);
  const { h, m, s } = useCountdown(target);
  const box = (label: string, v: number) => (
    <div className="rounded-xl bg-navy p-3 text-center text-white min-w-16">
      <div className="text-2xl font-extrabold text-gold tabular-nums">{String(v).padStart(2, "0")}</div>
      <div className="text-[10px] uppercase tracking-wider opacity-70">{label}</div>
    </div>
  );
  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-gold to-gold-light p-6 text-navy md:flex-row md:p-8">
        <div>
          <div className="flex items-center gap-2"><Zap className="h-5 w-5" /><span className="text-sm font-bold uppercase tracking-wider">Flash Sale</span></div>
          <h3 className="mt-2 text-2xl font-extrabold md:text-3xl">10% OFF — Ends Tonight!</h3>
          <p className="mt-1 text-sm opacity-80">Use code AMZ10 at checkout via WhatsApp</p>
        </div>
        <div className="flex gap-2">{box("Hrs", h)}{box("Min", m)}{box("Sec", s)}</div>
      </div>
    </section>
  );
}

function ProductRow({ title, ids }: { title: string; ids: Set<string> }) {
  const { products } = useProducts();
  const list = products.filter((p) => ids.has(p.id));
  if (!list.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-3xl font-extrabold text-navy">{title}</h2>
        <Link to="/products" className="text-sm font-bold text-navy hover:text-gold">View all →</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

const REVIEWS = [
  { name: "Ahmed K.", city: "Karachi", text: "Ordered AirPods on WhatsApp and got delivery in 2 days. Quality is amazing!", rating: 5 },
  { name: "Sara M.", city: "Lahore", text: "Best mobile accessories store. Their Ronin chargers are super fast and reliable.", rating: 5 },
  { name: "Bilal R.", city: "Islamabad", text: "Cash on delivery worked perfectly. Will order again. Highly recommended!", rating: 5 },
];

function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-6 text-center text-3xl font-extrabold text-navy">What our customers say</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="text-gold">{"★".repeat(r.rating)}</div>
            <p className="mt-3 text-sm text-foreground/80">"{r.text}"</p>
            <div className="mt-4 text-xs"><span className="font-bold text-navy">{r.name}</span> · <span className="text-muted-foreground">{r.city}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatsAppBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="overflow-hidden rounded-3xl bg-navy p-8 text-white md:p-12">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="inline-block rounded-full bg-whatsapp/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-whatsapp">Easiest checkout</div>
            <h3 className="mt-3 text-2xl font-extrabold md:text-4xl">Order Easily on WhatsApp!</h3>
            <p className="mt-2 max-w-md text-white/70">No signup needed — just message us your order and we'll handle the rest. Cash on Delivery available nationwide.</p>
          </div>
          <a href={waGeneral()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 self-start rounded-2xl bg-whatsapp px-8 py-5 text-base font-extrabold text-white shadow-2xl transition hover:scale-105">
            <MessageCircle className="h-6 w-6" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const items = [
    { Icon: Truck, title: "Free Delivery", sub: "Above Rs.2,000" },
    { Icon: ShieldCheck, title: "100% Original", sub: "Quality guaranteed" },
    { Icon: MessageCircle, title: "WhatsApp Support", sub: "Quick responses" },
    { Icon: Package2, title: "Cash on Delivery", sub: "Nationwide 🇵🇰" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map(({ Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-navy text-gold"><Icon className="h-5 w-5" /></div>
            <div>
              <div className="text-sm font-bold text-navy">{title}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-3xl border-2 border-dashed border-gold/40 bg-secondary p-8 text-center">
        <h3 className="text-2xl font-extrabold text-navy">Get exclusive offers</h3>
        <p className="mt-1 text-sm text-muted-foreground">Subscribe for deals, new arrivals and discount codes.</p>
        <form onSubmit={(e) => { e.preventDefault(); setEmail(""); import("sonner").then((m) => m.toast.success("Subscribed! Check your inbox 📩")); }} className="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@email.com" className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold" />
          <button className="rounded-lg bg-navy px-6 py-3 text-sm font-bold text-white hover:bg-navy-light">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <Trust />
      <CategoriesGrid />
      <FlashSale />
      <ProductRow title="Best Sellers" ids={BEST_SELLER_IDS} />
      <ProductRow title="New Arrivals" ids={NEW_IDS} />
      <WhatsAppBanner />
      <Reviews />
      <Newsletter />
    </>
  );
}

// silence unused for formatPrice import in case future
void formatPrice;
