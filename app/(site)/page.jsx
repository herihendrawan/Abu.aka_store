import { supabase } from "@/lib/supabase";
import Catalog from "@/components/Catalog";

export const revalidate = 60;

const Title = ({ children }) => (
  <div className="mb-8">
    <h2 className="font-heading text-3xl font-bold text-brand md:text-4xl">{children}</h2>
    <span className="mt-2 block h-1 w-12 rounded bg-gold" />
  </div>
);

export default async function Home() {
  const [{ data: s }, { data: categories }, { data: products }, { data: articles }] = await Promise.all([
    supabase.from("site_settings").select("*").single(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("articles").select("*").order("created_at", { ascending: false }).limit(3),
  ]);
  const st = s || {};
  const mapQ = encodeURIComponent(st.address || st.location_name || "");

  return (
    <main>
      <section className="pola bg-emerald-deep text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:gap-12 md:py-20">
          <div>
            <p lang="ar" className="font-heading text-2xl text-gold-soft/90">بسم الله الرحمن الرحيم</p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-[1.15] md:text-6xl">{st.hero_title}</h1>
            <p className="mt-4 max-w-md text-base text-white/80 md:text-lg">{st.hero_subtitle}</p>
            {st.location_name && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm text-white/85">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                {st.location_name}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#produk" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-emerald-deep hover:bg-gold-soft">Lihat produk</a>
              <a href="/artikel" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10">Baca artikel</a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[15rem] md:max-w-sm">
            <div className="aspect-[3/4] overflow-hidden rounded-t-full border-[3px] border-gold/80 bg-brand shadow-2xl">
              {st.hero_image_url && <img src={st.hero_image_url} alt="" className="h-full w-full object-cover" />}
            </div>
          </div>
        </div>
      </section>

      <section id="produk" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-12 md:py-16">
        <Title>Produk kami</Title>
        <Catalog products={products || []} categories={categories || []} wa={st.whatsapp_number} template={st.wa_template} />
      </section>

      {articles?.length > 0 && (
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex items-end justify-between">
              <Title>Artikel dakwah</Title>
              <a href="/artikel" className="mb-8 text-sm font-semibold text-brand underline">Lihat semua</a>
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

      {(st.address || st.location_name) && (
        <section id="lokasi" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-12 md:py-16">
          <Title>Lokasi toko</Title>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              {st.location_name && <h3 className="font-heading text-2xl font-bold">{st.location_name}</h3>}
              {st.address && <p className="mt-2 text-ink/80">{st.address}</p>}
              {st.open_hours && <p className="mt-3 text-sm text-ink/70">Jam buka: {st.open_hours}</p>}
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`} target="_blank" rel="noopener noreferrer"
                className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Buka di Google Maps</a>
            </div>
            <iframe title="Peta lokasi" loading="lazy" className="h-64 w-full rounded-xl border border-line md:h-72" src={`https://www.google.com/maps?q=${mapQ}&output=embed`} />
          </div>
        </section>
      )}
    </main>
  );
}
