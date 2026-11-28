const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://abuaka-store.vercel.app";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
