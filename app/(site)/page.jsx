import { supabase } from "@/lib/supabase";
import Catalog from "@/components/Catalog";
import SectionTitle from "@/components/SectionTitle";

export const revalidate = 60;

export default async function Home() {
  const [{ data: s }, { data: categories }, { data: products }, { data: articles }] = await Promise.all([
    supabase.from("site_settings").select("*").single(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("articles").select("*").order("created_at", { ascending: false }).limit(3),
  ]);
  const st = s || {};

  return (
    <main>
      <section className="pola bg-emerald-deep text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 md:grid-cols-2 md:gap-12 md:py-16">
          <div>
            <p lang="ar" className="font-heading text-xl text-gold-soft/90 md:text-2xl">بسم الله الرحمن الرحيم</p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-[1.15] md:text-5xl">{st.hero_title}</h1>
            <p className="mt-4 max-w-md text-base text-white/80">{st.hero_subtitle}</p>
            {st.location_name && (
              <a href="/lokasi" className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm text-white/85 hover:border-gold">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                {st.location_name}
              </a>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#produk" className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-emerald-deep hover:bg-gold-soft">Lihat produk</a>
              <a href="/artikel" className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold hover:bg-white/10">Baca artikel</a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[14rem] md:max-w-xs">
            <div className="aspect-[3/4] overflow-hidden rounded-t-full border-[3px] border-gold/80 bg-brand shadow-2xl">
              {st.hero_image_url && <img src={st.hero_image_url} alt="" className="h-full w-full object-cover" />}
            </div>
          </div>
        </div>
      </section>

      <section id="produk" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-10 md:py-14">
        <SectionTitle>Produk kami</SectionTitle>
        <Catalog products={products || []} categories={categories || []} wa={st.whatsapp_number} template={st.wa_template} shipping={st.shipping_label} area={st.delivery_area} />
      </section>

      {articles?.length > 0 && (
        <section className="border-t border-line bg-white py-8">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-heading text-xl font-bold text-brand">Artikel terbaru</h2>
              <a href="/artikel" className="text-sm font-semibold text-brand underline">Lihat semua</a>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {articles.map((a) => (
                <a key={a.id} href={`/artikel/${a.slug}`} className="rounded-lg border border-line p-4 hover:border-gold">
                  <h3 className="font-heading text-lg font-bold leading-snug">{a.title}</h3>
                  {a.excerpt && <p className="mt-1 line-clamp-2 text-sm text-ink/60">{a.excerpt}</p>}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
