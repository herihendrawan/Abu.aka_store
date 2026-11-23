import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function Detail({ params }) {
  const { slug } = await params;
  const { data: a } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
  if (!a) notFound();
  return (
    <article className="mx-auto max-w-2xl px-5 py-10 md:py-14">
      <a href="/artikel" className="text-sm font-semibold text-brand underline">Semua artikel</a>
      <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-brand md:text-4xl">{a.title}</h1>
      <p className="mt-2 text-sm text-ink/50">{new Date(a.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
      {a.cover_url && <img src={a.cover_url} alt="" className="mt-6 w-full rounded-xl" />}
      <div className="mt-8 space-y-5 text-lg leading-8">
        {a.content.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </article>
  );
}
