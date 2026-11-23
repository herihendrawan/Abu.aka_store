"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCart({ product }) {
  const { add, items } = useCart();
  const [done, setDone] = useState(false);
  const qty = items.find((x) => x.id === product.id)?.qty;
  return (
    <button
      onClick={() => { add(product); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="rounded-md bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
    >
      {done ? "Ditambahkan ✓" : qty ? `Di keranjang (${qty}) · Tambah` : "Tambah ke keranjang"}
    </button>
  );
}
