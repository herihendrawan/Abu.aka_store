import { supabase } from "@/lib/supabase";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://abuaka-store.vercel.app";
export const revalidate = 3600;

export default async function sitemap() {
  const [{ data: products }, { data: articles }] = await Promise.all([
    supabase.from("products").select("slug, updated_at"),
    supabase.from("articles").select("slug, created_at"),
  ]);
  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/artikel` },
    { url: `${BASE}/lokasi` },
    ...(products || []).map((p) => ({ url: `${BASE}/produk/${p.slug}`, lastModified: p.updated_at })),
    ...(articles || []).map((a) => ({ url: `${BASE}/artikel/${a.slug}`, lastModified: a.created_at })),
  ];
}
