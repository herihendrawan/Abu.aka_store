"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { rupiah } from "@/lib/wa";

export default function CartDrawer({ wa }) {
  const { items, setQty, clear, count, total } = useCart();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const checkout = () => {
    const lines = items.map((x, i) => `${i + 1}. ${x.name} x${x.qty} = ${rupiah(x.qty * x.price)}`);
    const text = [
      "Assalamu'alaikum, saya ingin memesan:", "", ...lines, "",
      `Total: ${rupiah(total)}`,
      ...(name ? ["", `Nama: ${name}`] : []),
      ...(note ? [`Catatan: ${note}`] : []),
    ].join("\n");
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Buka keranjang" className="relative rounded-full p-2 hover:bg-white/10">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h2.2l2.1 9.6a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.5-1.1L20 7.5H6.1" /><circle cx="9.5" cy="19" r="1.3" /><circle cx="16.5" cy="19" r="1.3" /></svg>
        {count > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-emerald-deep">{count}</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/50" onClick={() => setOpen(false)}>
          <aside onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-sm flex-col bg-white text-ink">
            <div className="flex items-center justify-between border-b border-line p-4">
              <h2 className="font-heading text-2xl font-bold text-brand">Keranjang</h2>
              <button onClick={() => setOpen(false)} className="text-sm underline">Tutup</button>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto">
              {items.length === 0 && <li className="p-6 text-center text-ink/60">Keranjang masih kosong.</li>}
              {items.map((x) => (
                <li key={x.id} className="flex gap-3 p-4">
                  {x.image_url ? <img src={x.image_url} alt="" className="h-16 w-16 rounded object-cover" /> : <div className="h-16 w-16 rounded bg-line" />}
                  <div className="flex-1">
                    <p className="font-semibold leading-snug">{x.name}</p>
                    <p className="text-sm text-ink/60">{rupiah(x.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => setQty(x.id, x.qty - 1)} className="h-7 w-7 rounded border border-line" aria-label="Kurangi">−</button>
                      <span className="w-6 text-center text-sm">{x.qty}</span>
                      <button onClick={() => setQty(x.id, x.qty + 1)} className="h-7 w-7 rounded border border-line" aria-label="Tambah">+</button>
                      <button onClick={() => setQty(x.id, 0)} className="ml-auto text-xs text-red-600 underline">Hapus</button>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-brand">{rupiah(x.qty * x.price)}</p>
                </li>
              ))}
            </ul>

            {items.length > 0 && (
              <div className="space-y-3 border-t border-line p-4">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda (opsional)" className="w-full rounded-md border border-line px-3 py-2 text-sm" />
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan / alamat (opsional)" className="w-full rounded-md border border-line px-3 py-2 text-sm" />
                <div className="flex items-center justify-between">
                  <span className="text-ink/70">Total</span>
                  <span className="text-xl font-bold text-brand">{rupiah(total)}</span>
                </div>
                <button onClick={checkout} disabled={!wa} className="w-full rounded-md bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-50">Pesan via WhatsApp</button>
                <button onClick={clear} className="w-full text-sm text-ink/60 underline">Kosongkan keranjang</button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
