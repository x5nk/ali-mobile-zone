import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Package, ShoppingBag, Tag, AlertTriangle, LogOut, Plus, Trash2, Pencil, ArrowLeft } from "lucide-react";
import { useAdminAuth, useOrders, useProducts, formatPrice } from "@/lib/store";
import { CATEGORIES, type Product } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Ali Mobile Zone" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { authed, login, logout } = useAdminAuth();
  if (!authed) return <Login onSubmit={(pw) => (login(pw) ? toast.success("Welcome back") : toast.error("Wrong password"))} />;
  return <Dashboard onLogout={logout} />;
}

function Login({ onSubmit }: { onSubmit: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  return (
    <div className="grid min-h-screen place-items-center bg-navy p-4">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(pw); }} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-2xl font-extrabold text-navy">Admin Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter password to continue</p>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className="mt-5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
        <button className="mt-3 w-full rounded-lg bg-navy py-3 text-sm font-bold text-white hover:bg-navy-light">Sign in</button>
        <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-navy">← Back to shop</Link>
      </form>
    </div>
  );
}

type Tab = "overview" | "products" | "orders";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { products, setProducts } = useProducts();
  const { orders, add: addOrder, remove: removeOrder } = useOrders();
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const lowStock = products.filter((p) => p.stock < 5);

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-lg border hover:bg-secondary"><ArrowLeft className="h-4 w-4" /></Link>
            <div>
              <h1 className="text-lg font-extrabold text-navy">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Ali Mobile Zone</p>
            </div>
          </div>
          <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-bold text-navy hover:bg-secondary"><LogOut className="h-4 w-4" /> Logout</button>
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 px-4">
          {(["overview", "products", "orders"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`border-b-2 px-4 py-2 text-sm font-bold capitalize ${tab === t ? "border-gold text-navy" : "border-transparent text-muted-foreground hover:text-navy"}`}>{t}</button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {tab === "overview" && (
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { Icon: Package, label: "Total Products", value: products.length, color: "bg-navy text-gold" },
              { Icon: ShoppingBag, label: "WhatsApp Orders", value: orders.length, color: "bg-whatsapp text-white" },
              { Icon: Tag, label: "Categories", value: CATEGORIES.length, color: "bg-gold text-navy" },
              { Icon: AlertTriangle, label: "Low Stock", value: lowStock.length, color: "bg-destructive text-white" },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl border bg-white p-5">
                <div className={`grid h-10 w-10 place-items-center rounded-lg ${c.color}`}><c.Icon className="h-5 w-5" /></div>
                <div className="mt-3 text-3xl font-extrabold text-navy">{c.value}</div>
                <div className="text-sm text-muted-foreground">{c.label}</div>
              </div>
            ))}
            {lowStock.length > 0 && (
              <div className="md:col-span-4 rounded-2xl border bg-white p-5">
                <h3 className="text-lg font-extrabold text-navy">Low stock items</h3>
                <div className="mt-3 divide-y">
                  {lowStock.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2 text-sm">
                      <span className="font-medium text-navy">{p.name}</span>
                      <span className="font-bold text-destructive">{p.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "products" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-navy">Products ({products.length})</h2>
              <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-navy-light"><Plus className="h-4 w-4" /> Add Product</button>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-white">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Stock</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/50">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded bg-white"><ProductImage src={p.image} alt={p.name} className="h-full w-full object-contain" /></div>
                          <div>
                            <div className="font-bold text-navy">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-2 text-right font-bold">{formatPrice(p.price)}</td>
                      <td className="px-4 py-2 text-right"><span className={p.stock < 5 ? "font-bold text-destructive" : ""}>{p.stock}</span></td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => setEditing(p)} className="mr-1 grid h-8 w-8 place-items-center rounded-lg hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => { if (confirm("Delete?")) { setProducts(products.filter((x) => x.id !== p.id)); toast.success("Deleted"); } }} className="grid h-8 w-8 place-items-center rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "orders" && <OrdersPanel orders={orders} onAdd={addOrder} onRemove={removeOrder} />}
      </main>

      {(editing || creating) && (
        <ProductForm
          initial={editing ?? undefined}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(p) => {
            if (editing) {
              setProducts(products.map((x) => (x.id === editing.id ? p : x)));
              toast.success("Updated");
            } else {
              setProducts([{ ...p, id: p.id || crypto.randomUUID() }, ...products]);
              toast.success("Created");
            }
            setEditing(null); setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function ProductForm({ initial, onSave, onClose }: { initial?: Product; onSave: (p: Product) => void; onClose: () => void }) {
  const [p, setP] = useState<Product>(
    initial ?? { id: "", name: "", price: 0, brand: "Ronin", category: "Chargers", image: "", stock: 10, description: "" },
  );
  return (
    <div className="fixed inset-0 z-[9998] grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(p); }} className="w-full max-w-lg rounded-2xl bg-white p-6">
        <h3 className="text-lg font-extrabold text-navy">{initial ? "Edit Product" : "New Product"}</h3>
        <div className="mt-4 grid gap-3">
          <Field label="Name"><input required value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} className="field" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (Rs.)"><input required type="number" value={p.price} onChange={(e) => setP({ ...p, price: +e.target.value })} className="field" /></Field>
            <Field label="Stock"><input required type="number" value={p.stock} onChange={(e) => setP({ ...p, stock: +e.target.value })} className="field" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Brand"><input required value={p.brand} onChange={(e) => setP({ ...p, brand: e.target.value })} className="field" /></Field>
            <Field label="Category">
              <select value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })} className="field">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Image URL"><input value={p.image} onChange={(e) => setP({ ...p, image: e.target.value })} className="field" /></Field>
          <Field label="Description"><textarea value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} rows={3} className="field" /></Field>
        </div>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border py-2.5 text-sm font-bold">Cancel</button>
          <button className="flex-1 rounded-lg bg-navy py-2.5 text-sm font-bold text-white hover:bg-navy-light">Save</button>
        </div>
        <style>{`.field{width:100%;border:1px solid var(--color-border);border-radius:0.5rem;padding:0.5rem 0.75rem;font-size:0.875rem;outline:none;}.field:focus{border-color:var(--color-gold);}`}</style>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</div>{children}</label>;
}

function OrdersPanel({ orders, onAdd, onRemove }: { orders: ReturnType<typeof useOrders>["orders"]; onAdd: (o: { name: string; phone: string; total: number; notes?: string }) => void; onRemove: (id: string) => void }) {
  const [f, setF] = useState({ name: "", phone: "", total: 0, notes: "" });
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border bg-white">
        <div className="border-b px-5 py-4"><h3 className="text-lg font-extrabold text-navy">Orders log ({orders.length})</h3></div>
        {orders.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">No orders logged yet. Add WhatsApp orders manually using the form.</div>
        ) : (
          <div className="divide-y">
            {orders.map((o) => (
              <div key={o.id} className="flex items-start justify-between gap-4 px-5 py-3 text-sm">
                <div>
                  <div className="font-bold text-navy">{o.name} <span className="text-muted-foreground font-normal">· {o.phone}</span></div>
                  <div className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</div>
                  {o.notes && <div className="mt-1 text-xs text-muted-foreground">{o.notes}</div>}
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-navy">{formatPrice(o.total)}</div>
                  <button onClick={() => onRemove(o.id)} className="mt-1 text-xs text-destructive hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (!f.name) return; onAdd(f); setF({ name: "", phone: "", total: 0, notes: "" }); toast.success("Order logged"); }} className="h-fit rounded-2xl border bg-white p-5">
        <h3 className="text-lg font-extrabold text-navy">Log WhatsApp order</h3>
        <div className="mt-4 space-y-3">
          <input placeholder="Customer name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gold" required />
          <input placeholder="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gold" />
          <input placeholder="Total (Rs.)" type="number" value={f.total || ""} onChange={(e) => setF({ ...f, total: +e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gold" />
          <textarea placeholder="Notes" rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gold" />
          <button className="w-full rounded-lg bg-navy py-2.5 text-sm font-bold text-white hover:bg-navy-light">Add order</button>
        </div>
      </form>
    </div>
  );
}
