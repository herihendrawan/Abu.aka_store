import CartDrawer from "./CartDrawer";

const links = [["Produk", "/#produk"], ["Artikel", "/artikel"], ["Lokasi", "/lokasi"]];

export default function Header({ s }) {
  return (
    <>
      {s.announcement && (
        <p className="flex items-center justify-center gap-1.5 bg-gold px-4 py-1.5 text-center text-xs font-semibold text-emerald-deep">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h11v10H2zM13 9h4l4 4v3h-8" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>
          {s.announcement}
        </p>
      )}
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
    </>
  );
}
