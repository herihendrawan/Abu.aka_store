import CartDrawer from "./CartDrawer";

const links = [["Produk", "/#produk"], ["Artikel", "/artikel"], ["Lokasi", "/#lokasi"]];

export default function Header({ s }) {
  return (
    <div className="sticky top-0 z-40 border-b border-gold/30 bg-emerald-deep text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 md:px-5">
        <a href="/" className="flex min-w-0 items-center gap-2.5">
          {s.logo_url && <img src={s.logo_url} alt="" className="h-9 w-9 shrink-0 rounded-full border border-gold/70 object-cover" />}
          <span className="truncate font-heading text-lg font-bold md:text-xl">{s.store_name}</span>
        </a>
        <div className="flex items-center gap-2">
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            {links.map(([l, h]) => <a key={l} href={h} className="hover:text-gold-soft">{l}</a>)}
          </nav>
          <CartDrawer wa={s.whatsapp_number} />
        </div>
      </div>
      <nav className="flex justify-center gap-8 border-t border-white/10 py-2 text-sm font-medium md:hidden">
        {links.map(([l, h]) => <a key={l} href={h}>{l}</a>)}
      </nav>
    </div>
  );
}
