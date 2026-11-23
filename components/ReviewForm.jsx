"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const input = "w-full rounded-md border border-line bg-white px-3 py-2 text-sm";
const OK = "Terima kasih! Ulasan akan tampil setelah disetujui admin.";

export default function ReviewForm({ productId }) {
  const [f, setF] = useState({ author: "", rating: 5, comment: "", website: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (f.website) return setMsg(OK); // jebakan untuk bot
    let last = 0;
    try { last = Number(localStorage.getItem("review_ts") || 0); } catch {}
    if (Date.now() - last < 60000) return setMsg("Mohon tunggu sebentar sebelum mengirim ulasan lagi.");
    setBusy(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId, author: f.author.trim(), rating: f.rating, comment: f.comment.trim(),
    });
    setBusy(false);
    if (error) return setMsg("Gagal mengirim ulasan. Coba lagi nanti.");
    try { localStorage.setItem("review_ts", String(Date.now())); } catch {}
    setF({ author: "", rating: 5, comment: "", website: "" });
    setMsg(OK);
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-line bg-white p-4">
      <h3 className="font-heading text-xl font-bold text-brand">Tulis ulasan</h3>
      <input className={input} required maxLength={60} placeholder="Nama Anda" value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} />
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} onClick={() => setF({ ...f, rating: n })} aria-label={`${n} bintang`}
            className={`text-2xl leading-none ${n <= f.rating ? "text-gold" : "text-line"}`}>★</button>
        ))}
      </div>
      <textarea className={input} required minLength={3} maxLength={600} rows={4} placeholder="Ceritakan pengalaman Anda" value={f.comment} onChange={(e) => setF({ ...f, comment: e.target.value })} />
      <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
      <button disabled={busy} className="rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50">{busy ? "Mengirim..." : "Kirim ulasan"}</button>
      {msg && <p className="text-sm text-ink/70">{msg}</p>}
    </form>
  );
}
