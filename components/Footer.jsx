export default function Footer({ s }) {
  return (
    <footer className="border-t-2 border-gold/60 bg-emerald-deep text-white/75">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-5 py-12 md:grid-cols-[1.4fr_1fr_1.6fr] md:gap-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            {s.logo_url && <img src={s.logo_url} alt="" className="h-10 w-10 rounded-full border border-gold/70 object-cover" />}
            <p className="font-heading text-2xl font-bold text-white">{s.store_name}</p>
          </div>
          {s.footer_text && <p className="mt-4 max-w-xs text-sm leading-relaxed">{s.footer_text}</p>}
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-gold-soft">Menu</p>
          <ul className="space-y-2.5">
            <li><a href="/#produk" className="hover:text-white">Produk</a></li>
            <li><a href="/artikel" className="hover:text-white">Artikel dakwah</a></li>
            <li><a href="/lokasi" className="hover:text-white">Lokasi</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-gold-soft">Lokasi &amp; kontak</p>
          <ul className="space-y-2.5">
            {s.location_name && <li className="font-semibold text-white">{s.location_name}</li>}
            {s.address && <li>{s.address}</li>}
            {s.open_hours && <li>Buka: {s.open_hours}</li>}
            {s.whatsapp_number && <li><a href={`https://wa.me/${s.whatsapp_number}`} className="hover:text-white">WhatsApp +{s.whatsapp_number}</a></li>}
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-5 py-4 pb-20 text-center text-xs md:pb-4">© {new Date().getFullYear()} {s.store_name}. Semua hak dilindungi.</p>
    </footer>
  );
}
