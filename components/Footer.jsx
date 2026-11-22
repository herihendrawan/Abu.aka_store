export default function Footer({ s }) {
  return (
    <footer className="pola bg-emerald-deep text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-heading text-2xl font-bold text-white">{s.store_name}</p>
          <p className="mt-3 text-sm">{s.footer_text}</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-gold-soft">Menu</p>
          <ul className="space-y-2">
            <li><a href="/#produk">Produk</a></li>
            <li><a href="/artikel">Artikel dakwah</a></li>
            <li><a href="/#lokasi">Lokasi</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-gold-soft">Hubungi kami</p>
          <p>{s.address}</p>
          {s.whatsapp_number && <a className="mt-2 inline-block underline" href={`https://wa.me/${s.whatsapp_number}`}>WhatsApp +{s.whatsapp_number}</a>}
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} {s.store_name}. Semua hak dilindungi.</p>
    </footer>
  );
}
