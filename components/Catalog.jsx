"use client";
import { useState } from "react";
import { rupiah, waLink } from "@/lib/wa";
import { useCart } from "./CartProvider";

const Truck = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h11v10H2zM13 9h4l4 4v3h-8" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>
);
const Pin = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);

export default function Catalog({ products, categories, wa, template, shipping, area }) {
  const [cat, setCat] = useState("all");
  const { add, items } = useCart();
  const list = cat === "all" ? products : products.filter((p) => p.category_id === cat);
  const tab = (on) => `shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium ${on ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-gold"}`;

  return (
    <>
      <div className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <button onClick={() => setCat("all")} className={tab(cat === "all")}>Semua</button>
        {categories.map((c) => <button key={c.id} onClick={() => setCat(c.id)} className={tab(cat === c.id)}>{c.name}</button>)}
      </div>
      {list.length === 0 && <p className="text-ink/60">Belum ada produk di kategori ini.</p>}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {list.map((p) => {
          const sale = p.original_price > p.price;
          const sold = p.stock_status === "habis";
          const inCart = items.find((x) => x.id === p.id)?.qty;
          return (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
              <div className="relative aspect-square bg-white">
                {p.image_url && <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover" />}
                {sale && <span className="absolute left-2 top-2 rounded bg-gold px-2 py-0.5 text-xs font-bold text-emerald-deep">-{Math.round((1 - p.price / p.original_price) * 100)}%</span>}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h3 className="font-semibold leading-snug">{p.name}</h3>
                {p.description && <p className="mt-1 line-clamp-2 text-sm text-ink/60">{p.description}</p>}
                <div className="mt-auto pt-2">
                  {sale && <p className="text-sm text-ink/45 line-through">{rupiah(p.original_price)}</p>}
                  <p className="text-lg font-bold text-brand">{rupiah(p.price)}</p>
                  {(shipping || area) && (
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                      {shipping && <span className="inline-flex items-center gap-1 font-medium text-brand"><Truck />{shipping}</span>}
                      {area && <span className="inline-flex items-center gap-1 text-ink/60"><Pin />{area}</span>}
                    </p>
                  )}
                </div>
                {sold ? (
                  <span className="mt-3 rounded-md bg-line py-2 text-center text-sm font-semibold text-ink/50">Stok habis</span>
                ) : (
                  <>
                    <button onClick={() => add(p)} className="mt-3 rounded-md bg-brand py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                      {inCart ? `Di keranjang (${inCart}) · Tambah` : "Tambah ke keranjang"}
                    </button>
                    <a href={waLink(wa, template, p)} target="_blank" rel="noopener noreferrer" className="mt-2 text-center text-xs text-ink/60 underline">Beli langsung via WhatsApp</a>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
