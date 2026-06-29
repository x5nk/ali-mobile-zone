import { useEffect, useState, useCallback } from "react";
import { SEED_PRODUCTS, type Product } from "./products";

const LS = {
  products: "amz:products",
  cart: "amz:cart",
  wishlist: "amz:wishlist",
  orders: "amz:orders",
  adminAuth: "amz:admin",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("amz:store", { detail: key }));
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    setValue(read<T>(key, fallback));
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === key || detail === undefined) setValue(read<T>(key, fallback));
    };
    window.addEventListener("amz:store", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("amz:store", handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const setter = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        write(key, v);
        return v;
      });
    },
    [key],
  );
  return [value, setter] as const;
}

// ---------- Products ----------
export function useProducts() {
  const [products, setProducts] = useStored<Product[]>(LS.products, SEED_PRODUCTS);
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(LS.products)) {
      write(LS.products, SEED_PRODUCTS);
    }
  }, []);
  return { products: products.length ? products : SEED_PRODUCTS, setProducts };
}

export function useProduct(id: string | undefined) {
  const { products } = useProducts();
  return products.find((p) => p.id === id);
}

// ---------- Cart ----------
export type CartItem = { id: string; qty: number };
export function useCart() {
  const [cart, setCart] = useStored<CartItem[]>(LS.cart, []);
  const { products } = useProducts();

  const add = (id: string, qty = 1) =>
    setCart((c) => {
      const ex = c.find((x) => x.id === id);
      if (ex) return c.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x));
      return [...c, { id, qty }];
    });
  const remove = (id: string) => setCart((c) => c.filter((x) => x.id !== id));
  const setQty = (id: string, qty: number) =>
    setCart((c) => (qty <= 0 ? c.filter((x) => x.id !== id) : c.map((x) => (x.id === id ? { ...x, qty } : x))));
  const clear = () => setCart([]);

  const detailed = cart
    .map((c) => {
      const p = products.find((p) => p.id === c.id);
      return p ? { ...c, product: p, lineTotal: p.price * c.qty } : null;
    })
    .filter(Boolean) as Array<CartItem & { product: Product; lineTotal: number }>;
  const subtotal = detailed.reduce((s, x) => s + x.lineTotal, 0);
  const count = cart.reduce((s, x) => s + x.qty, 0);

  return { cart, detailed, subtotal, count, add, remove, setQty, clear };
}

// ---------- Wishlist ----------
export function useWishlist() {
  const [list, setList] = useStored<string[]>(LS.wishlist, []);
  const toggle = (id: string) =>
    setList((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const has = (id: string) => list.includes(id);
  return { list, toggle, has };
}

// ---------- Admin Orders Log ----------
export type LoggedOrder = { id: string; name: string; phone: string; total: number; createdAt: string; notes?: string };
export function useOrders() {
  const [orders, setOrders] = useStored<LoggedOrder[]>(LS.orders, []);
  const add = (o: Omit<LoggedOrder, "id" | "createdAt">) =>
    setOrders((list) => [{ ...o, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...list]);
  const remove = (id: string) => setOrders((list) => list.filter((x) => x.id !== id));
  return { orders, add, remove };
}

// ---------- Admin Auth ----------
export const ADMIN_PASSWORD = "ali2024";
export function useAdminAuth() {
  const [authed, setAuthed] = useStored<boolean>(LS.adminAuth, false);
  return { authed, login: (pw: string) => (pw === ADMIN_PASSWORD ? (setAuthed(true), true) : false), logout: () => setAuthed(false) };
}

export type User = { email: string; createdAt: string };
export type SignupResult = { success: true } | { success: false; message: string };

export function useUserAuth() {
  const [user, setUser] = useStored<User | null>("amz:user", null);
  const [users, setUsers] = useStored<Array<User & { password: string }>>("amz:user-list", []);

  const login = (email: string, password: string) => {
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!match || match.password !== password) return false;
    setUser({ email: match.email, createdAt: match.createdAt });
    return true;
  };

  const signup = (email: string, password: string): SignupResult => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return { success: false, message: "Enter a valid email." };
    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      return { success: false, message: "An account with that email already exists." };
    }
    const newUser = { email: normalized, password, createdAt: new Date().toISOString() };
    setUsers((prev) => [...prev, newUser]);
    setUser({ email: normalized, createdAt: newUser.createdAt });
    return { success: true };
  };

  const logout = () => setUser(null);

  return { user, login, signup, logout };
}

export const formatPrice = (n: number) => `Rs.${n.toLocaleString("en-PK")}`;
