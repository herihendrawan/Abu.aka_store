import { supabase } from "@/lib/supabase";
import SectionTitle from "@/components/SectionTitle";

export const revalidate = 60;

export default async function Lokasi() {
  const { data } = await supabase.from("site_settings").select("*").single();
  const st = data || {};
  const rows = [["Alamat", st.address], ["Kelurahan", st.kelurahan], ["Kecamatan", st.kecamatan], ["Kota/Kab.", st.city], ["Provinsi", st.province], ["Kode pos", st.postal_code], ["Jam buka", st.open_hours]].filter(([, v]) => v);
  const full = [st.address, st.kelurahan, st.kecamatan, st.city, st.province, st.postal_code].filter(Boolean).join(", ") || st.location_name || "";
  const mapQ = encodeURIComponent(full);
  const mapsHref = st.maps_url || `https://www.google.com/maps/search/?api=1&query=${mapQ}`;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <SectionTitle>Lokasi toko</SectionTitle>
      {!rows.length && !st.location_name ? (
        <p className="text-ink/60">Informasi lokasi belum diisi.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-5">
            {st.location_name && <h3 className="font-heading text-2xl font-bold text-brand">{st.location_name}</h3>}
            <dl className="mt-3 divide-y divide-line text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 py-2.5">
                  <dt className="text-ink/55">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer"
              className="mt-5 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Buka titik lokasi di Google Maps</a>
          </div>
          <iframe title="Peta lokasi" loading="lazy" className="h-64 w-full rounded-xl border border-line md:h-full md:min-h-72" src={`https://www.google.com/maps?q=${mapQ}&output=embed`} />
        </div>
      )}
    </main>
  );
}
