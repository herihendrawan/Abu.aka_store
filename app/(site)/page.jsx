import { supabase } from "@/lib/supabase";
import Catalog from "@/components/Catalog";

export const revalidate = 60;

export default async function Home() {
  const [{ data: s }, { data: categories }, { data: products }, { data: articles }] = await Promise.all([
    supabase.from("site_settings").select("*").single(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("articles").select("*").order("created_at", { ascending: false }).limit(3),
  ]);
  const st = s || {};
  const mapQ = encodeURIComponent(st.address || "");

  return (
    <main>
      <section className="pola bg-emerald-deep text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-24">
          <div>
            <p lang="ar" dir="rtl" className="font-heading text-3xl text-gold-soft">بسم الله الرحمن الرحيم</p>
            <h1 className="mt-5 font-heading text-5xl font-bold leading-[1.1] md:text-7xl">{st.hero_title}</h1>
            <p className="mt-5 max-w-md text-lg text-white/80">{st.hero_subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#produk" className="rounded-full bg-gold px-6 py-3 font-semibold text-emerald-deep hover:bg-gold-soft">Lihat produk</a>
              <a href="/artikel" className="rounded-full border border-gold-soft/60 px-6 py-3 font-semibold hover:bg-white/10">Baca artikel</a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-xs md:max-w-sm">
            <div className="aspect-[3/4] overflow-hidden rounded-t-full border-4 border-gold bg-brand shadow-2xl">
              {st.hero_image_url && <img src={st.hero_image_url} alt="" className="h-full w-full object-cover" />}
            </div>
          </div>
        </div>
      </section>

      <section id="produk" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-16">
        <h2 className="mb-8 font-heading text-4xl font-bold text-brand">Produk kami</h2>
        <Catalog products={products || []} categories={categories || []} wa={st.whatsapp_number} template={st.wa_template} />
      </section>

      {articles?.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-heading text-4xl font-bold text-brand">Artikel dakwah</h2>
              <a href="/artikel" className="text-sm font-semibold text-brand underline">Lihat semua</a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {articles.map((a) => (
                <a key={a.id} href={`/artikel/${a.slug}`} className="overflow-hidden rounded-xl border border-line hover:border-gold">
                  {a.cover_url && <img src={a.cover_url} alt="" loading="lazy" className="aspect-video w-full object-cover" />}
                  <div className="p-4"><h3 className="font-heading text-xl font-bold">{a.title}</h3><p className="mt-1 line-clamp-2 text-sm text-ink/60">{a.excerpt}</p></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {st.address && (
        <section id="lokasi" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-16">
          <h2 className="mb-8 font-heading text-4xl font-bold text-brand">Lokasi toko</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-lg">{st.address}</p>
              {st.open_hours && <p className="mt-3 text-ink/70">Jam buka: {st.open_hours}</p>}
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`} target="_blank" rel="noopener noreferrer"
                className="mt-5 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">Buka di Google Maps</a>
            </div>
            <iframe title="Peta lokasi" loading="lazy" className="h-72 w-full rounded-xl border border-line" src={`https://www.google.com/maps?q=${mapQ}&output=embed`} />
          </div>
        </section>
      )}
    </main>
  );
}
