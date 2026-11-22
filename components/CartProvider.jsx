"use client";
import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("cart") || "[]")); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) try { localStorage.setItem("cart", JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const add = (p) =>
    setItems((cur) =>
      cur.some((x) => x.id === p.id)
        ? cur.map((x) => (x.id === p.id ? { ...x, qty: Math.min(x.qty + 1, 99) } : x))
        : [...cur, { id: p.id, name: p.name, price: p.price, image_url: p.image_url, qty: 1 }]
    );
  const setQty = (id, qty) =>
    setItems((cur) => (qty < 1 ? cur.filter((x) => x.id !== id) : cur.map((x) => (x.id === id ? { ...x, qty: Math.min(qty, 99) } : x))));
  const clear = () => setItems([]);
  const count = items.reduce((a, x) => a + x.qty, 0);
  const total = items.reduce((a, x) => a + x.qty * x.price, 0);

  return <Ctx.Provider value={{ items, add, setQty, clear, count, total }}>{children}</Ctx.Provider>;
}
