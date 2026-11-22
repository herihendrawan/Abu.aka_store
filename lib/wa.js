export const rupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");
export const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function waLink(number, template, p, qty = 1) {
  const text = (template || "Halo, saya mau pesan {produk} ({harga}). Jumlah: {jumlah}")
    .replace("{produk}", p.name)
    .replace("{harga}", rupiah(p.price))
    .replace("{jumlah}", qty);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
