import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/store";
import { CATEGORIES } from "@/lib/products";
import { SlidersHorizontal, X } from "lucide-react";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  sort: z.enum(["popular", "newest", "price-asc", "price-desc"]).optional(),
  page: z.number().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "All Products — Ali Mobile Zone" }, { name: "description", content: "Browse all mobile accessories: chargers, headphones, earbuds and more." }] }),
  component: ProductsPage,
});

const PAGE_SIZE = 12;

function ProductsPage() {
  const { products } = useProducts();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [maxPrice, setMaxPrice] = useState(15000);
  const [open, setOpen] = useState(false);

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (search.q) {
      const q = search.q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (search.category) list = list.filter((p) => p.category === search.category);
    if (search.brand) list = list.filter((p) => p.brand === search.brand);
    list = list.filter((p) => p.price <= maxPrice);
    switch (search.sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "newest": list = [...list].reverse(); break;
      default: break;
    }
    return list;
  }, [products, search, maxPrice]);

  const page = search.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const update = (partial: Record<string, unknown>) =>
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, ...partial, page: 1 }) as never });

  const FilterContent = (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy">Category</h4>
        <div className="space-y-1.5">
          <button onClick={() => update({ category: undefined })} className={`block w-full rounded-md px-2 py-1 text-left text-sm ${!search.category ? "bg-navy text-white" : "hover:bg-secondary"}`}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => update({ category: c })} className={`block w-full rounded-md px-2 py-1 text-left text-sm ${search.category === c ? "bg-navy text-white" : "hover:bg-secondary"}`}>{c}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy">Brand</h4>
        <div className="space-y-1.5">
          <button onClick={() => update({ brand: undefined })} className={`block w-full rounded-md px-2 py-1 text-left text-sm ${!search.brand ? "bg-navy text-white" : "hover:bg-secondary"}`}>All</button>
          {brands.map((b) => (
            <button key={b} onClick={() => update({ brand: b })} className={`block w-full rounded-md px-2 py-1 text-left text-sm ${search.brand === b ? "bg-navy text-white" : "hover:bg-secondary"}`}>{b}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy">Max Price: Rs.{maxPrice.toLocaleString()}</h4>
        <input type="range" min={500} max={15000} step={250} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-[color:var(--gold)]" />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy">All Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} products available</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium md:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <select value={search.sort ?? "popular"} onChange={(e) => update({ sort: e.target.value })} className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-gold">
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-24 rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">{FilterContent}</div>
        </aside>

        <div>
          {paged.length === 0 ? (
            <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">No products match these filters.</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {paged.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, page: i + 1 }) as never })} className={`h-9 w-9 rounded-lg text-sm font-bold ${page === i + 1 ? "bg-navy text-white" : "border bg-white text-navy hover:bg-secondary"}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[9998] flex md:hidden" onClick={() => setOpen(false)}>
          <div className="ml-auto h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-navy">Filters</h3>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            {FilterContent}
          </div>
        </div>
      )}
    </div>
  );
}
