import { supabase } from "@/lib/supabase";

export const revalidate = 60;
export const metadata = { title: "Artikel dakwah" };

export default async function Artikel() {
  const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="mb-8 font-heading text-5xl font-bold text-brand">Artikel dakwah</h1>
      {(!data || data.length === 0) && <p className="text-ink/60">Belum ada artikel.</p>}
      <div className="grid gap-5 md:grid-cols-3">
        {(data || []).map((a) => (
          <a key={a.id} href={`/artikel/${a.slug}`} className="overflow-hidden rounded-xl border border-line bg-white hover:border-gold">
            {a.cover_url && <img src={a.cover_url} alt="" loading="lazy" className="aspect-video w-full object-cover" />}
            <div className="p-4">
              <h2 className="font-heading text-xl font-bold">{a.title}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-ink/60">{a.excerpt}</p>
              <p className="mt-3 text-xs text-ink/50">{new Date(a.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
