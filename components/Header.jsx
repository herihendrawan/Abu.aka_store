export default function Header({ s }) {
  return (
    <div className="sticky top-0 z-40 border-b border-gold/40 bg-emerald-deep text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <a href="/" className="flex items-center gap-3">
          {s.logo_url && <img src={s.logo_url} alt="" className="h-9 w-9 rounded-full border border-gold object-cover" />}
          <span className="font-heading text-xl font-bold">{s.store_name}</span>
        </a>
        <nav className="flex gap-5 text-sm font-medium">
          <a href="/#produk" className="hover:text-gold-soft">Produk</a>
          <a href="/artikel" className="hover:text-gold-soft">Artikel</a>
          <a href="/#lokasi" className="hover:text-gold-soft">Lokasi</a>
        </nav>
      </div>
    </div>
  );
}
