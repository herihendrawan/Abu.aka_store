import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { rupiah, waLink } from "@/lib/wa";
import AddToCart from "@/components/AddToCart";
import ReviewForm from "@/components/ReviewForm";
import SectionTitle from "@/components/SectionTitle";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data } = await supabase.from("products").select("name").eq("slug", slug).maybeSingle();
  return { title: data?.name || "Produk" };
}

const Stars = ({ n }) => (
  <span aria-label={`${n} dari 5`}><span className="text-gold">{"★".repeat(n)}</span><span className="text-line">{"★".repeat(5 - n)}</span></span>
);

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const { data: p } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (!p) notFound();
  const [{ data: s }, { data: reviews }] = await Promise.all([
    supabase.from("site_settings").select("*").single(),
    supabase.from("reviews").select("*").eq("product_id", p.id).eq("is_approved", true).order("created_at", { ascending: false }),
  ]);
  const st = s || {};
  const list = reviews || [];
  const avg = list.length ? list.reduce((a, r) => a + r.rating, 0) / list.length : 0;
  const sale = p.original_price > p.price;
  const sold = p.stock_status === "habis";

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 md:py-12">
      <a href="/#produk" className="text-sm font-semibold text-brand underline">← Semua produk</a>

      <div className="mt-5 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-white">
          {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}
          {sale && <span className="absolute left-3 top-3 rounded bg-gold px-2 py-0.5 text-sm font-bold text-emerald-deep">-{Math.round((1 - p.price / p.original_price) * 100)}%</span>}
        </div>

        <div>
          <h1 className="font-heading text-3xl font-bold leading-tight md:text-4xl">{p.name}</h1>
          <p className="mt-2 text-sm text-ink/70">
            {list.length ? <><Stars n={Math.round(avg)} /> <span className="ml-1">{avg.toFixed(1)} ({list.length} ulasan)</span></> : "Belum ada ulasan"}
          </p>
          <div className="mt-4">
            {sale && <p className="text-ink/45 line-through">{rupiah(p.original_price)}</p>}
            <p className="text-3xl font-bold text-brand">{rupiah(p.price)}</p>
          </div>
          {(st.shipping_label || st.delivery_area) && (
            <p className="mt-2 text-sm font-medium text-brand">{[st.shipping_label, st.delivery_area].filter(Boolean).join(" · ")}</p>
          )}
          {p.description && <p className="mt-5 whitespace-pre-line leading-relaxed text-ink/80">{p.description}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {sold ? <span className="rounded-md bg-line px-6 py-3 font-semibold text-ink/50">Stok habis</span> : <AddToCart product={p} />}
            {!sold && <a href={waLink(st.whatsapp_number, st.wa_template, p)} target="_blank" rel="noopener noreferrer" className="text-sm underline">Beli langsung via WhatsApp</a>}
          </div>
        </div>
      </div>

      <section className="mt-14">
        <SectionTitle>Ulasan pembeli</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            {list.length === 0 && <p className="text-ink/60">Jadilah yang pertama memberi ulasan.</p>}
            {list.map((r) => (
              <article key={r.id} className="rounded-xl border border-line bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{r.author}</p>
                  <Stars n={r.rating} />
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-ink/80">{r.comment}</p>
                <p className="mt-2 text-xs text-ink/45">{new Date(r.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
              </article>
            ))}
          </div>
          <ReviewForm productId={p.id} />
        </div>
      </section>
    </main>
  );
}
