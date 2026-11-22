"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { slugify, rupiah } from "@/lib/wa";
import ImageField from "@/components/ImageField";

const input = "w-full rounded-md border border-line bg-white px-3 py-2";
const btn = "rounded-md bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark";
const empty = { name: "", price: "", original_price: "", description: "", category_id: "", stock_status: "ready", is_active: true };

export default function Admin() {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  if (!session) return <Login />;
  return <Panel />;
}

function Login() {
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword(f);
    if (error) setErr("Email atau password salah.");
  };
  return (
    <form onSubmit={submit} className="mx-auto mt-24 max-w-sm space-y-3 px-5">
      <h1 className="text-2xl font-bold">Masuk admin</h1>
      <input className={input} type="email" placeholder="Email" onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input className={input} type="password" placeholder="Password" onChange={(e) => setF({ ...f, password: e.target.value })} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className={btn + " w-full"}>Masuk</button>
    </form>
  );
}

function Panel() {
  const [tab, setTab] = useState("produk");
  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <div className="mb-6 flex items-center justify-between">
        <nav className="flex gap-2">
          {["produk", "artikel", "kategori", "pengaturan"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${tab === t ? "bg-brand text-white" : "bg-white border border-line"}`}>{t}</button>
          ))}
        </nav>
        <button className="text-sm underline" onClick={() => supabase.auth.signOut()}>Keluar</button>
      </div>
      {tab === "produk" && <Products />}
      {tab === "artikel" && <Articles />}
      {tab === "kategori" && <Categories />}
      {tab === "pengaturan" && <Settings />}
    </div>
  );
}

function Products() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setItems((await supabase.from("products").select("*").order("created_at", { ascending: false })).data || []);
    setCats((await supabase.from("categories").select("*").order("sort_order")).data || []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setMsg("Menyimpan...");
    let image_url = editing?.image_url || null;
    if (file) {
      const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const up = await supabase.storage.from("products").upload(path, file);
      if (up.error) return setMsg("Gagal upload foto: " + up.error.message);
      image_url = supabase.storage.from("products").getPublicUrl(path).data.publicUrl;
    }
    const row = { ...form, price: Number(form.price), original_price: form.original_price ? Number(form.original_price) : null, category_id: form.category_id || null, image_url };
    const res = editing
      ? await supabase.from("products").update(row).eq("id", editing.id)
      : await supabase.from("products").insert({ ...row, slug: slugify(form.name) + "-" + Date.now().toString(36).slice(-4) });
    if (res.error) return setMsg("Gagal menyimpan: " + res.error.message);
    setForm(empty); setEditing(null); setFile(null); setMsg("Tersimpan."); load();
  };

  const edit = (p) => { setEditing(p); setForm({ name: p.name, price: p.price, original_price: p.original_price || "", description: p.description || "", category_id: p.category_id || "", stock_status: p.stock_status, is_active: p.is_active }); window.scrollTo(0, 0); };
  const del = async (p) => { if (confirm(`Hapus "${p.name}"?`)) { await supabase.from("products").delete().eq("id", p.id); load(); } };

  return (
    <>
      <form onSubmit={save} className="mb-8 grid gap-3 rounded-lg border border-line bg-white p-4 md:grid-cols-2">
        <input className={input} required placeholder="Nama produk" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={input} required type="number" min="0" placeholder="Harga jual (Rp)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className={input} type="number" min="0" placeholder="Harga coret / sebelum diskon (opsional)" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} />
        <select className={input} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
          <option value="">Tanpa kategori</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className={input} value={form.stock_status} onChange={(e) => setForm({ ...form, stock_status: e.target.value })}>
          <option value="ready">Ready</option><option value="habis">Habis</option>
        </select>
        <textarea className={input + " md:col-span-2"} placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="md:col-span-2" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Tampilkan di website</label>
        <div className="flex items-center gap-3 md:col-span-2">
          <button className={btn}>{editing ? "Simpan perubahan" : "Tambah produk"}</button>
          {editing && <button type="button" className="text-sm underline" onClick={() => { setEditing(null); setForm(empty); }}>Batal</button>}
          <span className="text-sm text-ink/60">{msg}</span>
        </div>
      </form>

      <ul className="divide-y divide-line rounded-lg border border-line bg-white">
        {items.length === 0 && <li className="p-4 text-ink/60">Belum ada produk. Tambahkan produk pertama di atas.</li>}
        {items.map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-3">
            {p.image_url ? <img src={p.image_url} alt="" className="h-12 w-12 rounded object-cover" /> : <div className="h-12 w-12 rounded bg-line" />}
            <div className="flex-1"><p className="font-semibold">{p.name} {!p.is_active && <span className="text-xs text-ink/50">(disembunyikan)</span>}</p><p className="text-sm text-ink/60">{rupiah(p.price)} · {p.stock_status}</p></div>
            <button className="text-sm underline" onClick={() => edit(p)}>Edit</button>
            <button className="text-sm text-red-600 underline" onClick={() => del(p)}>Hapus</button>
          </li>
        ))}
      </ul>
    </>
  );
}

function Categories() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState("");
  const load = async () => setCats((await supabase.from("categories").select("*").order("sort_order")).data || []);
  useEffect(() => { load(); }, []);
  const add = async (e) => {
    e.preventDefault();
    await supabase.from("categories").insert({ name, slug: slugify(name), sort_order: cats.length });
    setName(""); load();
  };
  const del = async (c) => { if (confirm(`Hapus kategori "${c.name}"?`)) { await supabase.from("categories").delete().eq("id", c.id); load(); } };
  return (
    <>
      <form onSubmit={add} className="mb-6 flex gap-2">
        <input className={input} required placeholder="Nama kategori" value={name} onChange={(e) => setName(e.target.value)} />
        <button className={btn}>Tambah</button>
      </form>
      <ul className="divide-y divide-line rounded-lg border border-line bg-white">
        {cats.map((c) => (
          <li key={c.id} className="flex justify-between p-3"><span>{c.name}</span><button className="text-sm text-red-600 underline" onClick={() => del(c)}>Hapus</button></li>
        ))}
      </ul>
    </>
  );
}

function Settings() {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { supabase.from("site_settings").select("*").single().then(({ data }) => setS(data)); }, []);
  if (!s) return null;
  const save = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("site_settings").update(s).eq("id", 1);
    setMsg(error ? "Gagal menyimpan: " + error.message : "Tersimpan.");
  };
  const field = (k, label, hint) => (
    <label className="block text-sm font-medium">{label}
      <input className={input + " mt-1 font-normal"} value={s[k] || ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} />
      {hint && <span className="text-xs font-normal text-ink/50">{hint}</span>}
    </label>
  );
  return (
    <form onSubmit={save} className="max-w-xl space-y-4">
      {field("store_name", "Nama toko")}
      {field("whatsapp_number", "Nomor WhatsApp", "Format 62xxxxxxxxxx, tanpa + atau spasi")}
      {field("hero_title", "Judul utama")}
      {field("hero_subtitle", "Subjudul")}
      {field("wa_template", "Template pesan WhatsApp", "Gunakan {produk}, {harga}, {jumlah}")}
      <ImageField label="Logo toko" value={s.logo_url} onChange={(u) => setS({ ...s, logo_url: u })} />
      <ImageField label="Foto utama (hero)" value={s.hero_image_url} onChange={(u) => setS({ ...s, hero_image_url: u })} />
      {field("location_name", "Nama lokasi", "Contoh: Abu Aka Store, Pekanbaru")}
      {field("address", "Alamat toko", "Dipakai untuk peta Google Maps")}
      {field("open_hours", "Jam buka", "Contoh: Senin-Sabtu, 08.00-17.00")}
      {field("footer_text", "Teks footer")}
      <div className="flex items-center gap-3"><button className={btn}>Simpan pengaturan</button><span className="text-sm text-ink/60">{msg}</span></div>
    </form>
  );
}

function Articles() {
  const blank = { title: "", excerpt: "", content: "", cover_url: "", is_published: true };
  const [items, setItems] = useState([]);
  const [f, setF] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const load = async () => setItems((await supabase.from("articles").select("*").order("created_at", { ascending: false })).data || []);
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    setMsg("Menyimpan...");
    const res = editId
      ? await supabase.from("articles").update(f).eq("id", editId)
      : await supabase.from("articles").insert({ ...f, slug: slugify(f.title) + "-" + Date.now().toString(36).slice(-4) });
    if (res.error) return setMsg("Gagal menyimpan: " + res.error.message);
    setF(blank); setEditId(null); setMsg("Tersimpan."); load();
  };
  const edit = (a) => { setEditId(a.id); setF({ title: a.title, excerpt: a.excerpt || "", content: a.content, cover_url: a.cover_url || "", is_published: a.is_published }); window.scrollTo(0, 0); };
  const del = async (a) => { if (confirm(`Hapus "${a.title}"?`)) { await supabase.from("articles").delete().eq("id", a.id); load(); } };
  return (
    <>
      <form onSubmit={save} className="mb-8 space-y-3 rounded-lg border border-line bg-white p-4">
        <input className={input} required placeholder="Judul artikel" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <input className={input} placeholder="Ringkasan singkat" value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} />
        <ImageField label="Gambar sampul" value={f.cover_url} onChange={(u) => setF({ ...f, cover_url: u })} />
        <textarea className={input} required rows={10} placeholder="Isi artikel (pisahkan paragraf dengan baris kosong)" value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_published} onChange={(e) => setF({ ...f, is_published: e.target.checked })} /> Terbitkan</label>
        <div className="flex items-center gap-3">
          <button className={btn}>{editId ? "Simpan perubahan" : "Tambah artikel"}</button>
          {editId && <button type="button" className="text-sm underline" onClick={() => { setEditId(null); setF(blank); }}>Batal</button>}
          <span className="text-sm text-ink/60">{msg}</span>
        </div>
      </form>
      <ul className="divide-y divide-line rounded-lg border border-line bg-white">
        {items.length === 0 && <li className="p-4 text-ink/60">Belum ada artikel.</li>}
        {items.map((a) => (
          <li key={a.id} className="flex items-center gap-3 p-3">
            <div className="flex-1"><p className="font-semibold">{a.title}</p><p className="text-sm text-ink/60">{a.is_published ? "Terbit" : "Draft"}</p></div>
            <button className="text-sm underline" onClick={() => edit(a)}>Edit</button>
            <button className="text-sm text-red-600 underline" onClick={() => del(a)}>Hapus</button>
          </li>
        ))}
      </ul>
    </>
  );
}
