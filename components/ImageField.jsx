"use client";
import { useState } from "react";
import { uploadImage } from "@/lib/upload";

export default function ImageField({ label, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setBusy(true);
    try { onChange(await uploadImage(f)); } catch (err) { alert("Gagal upload: " + err.message); }
    setBusy(false);
  };
  return (
    <div className="text-sm font-medium">{label}
      <div className="mt-1 flex items-center gap-3">
        {value ? <img src={value} alt="" className="h-14 w-14 rounded border border-line object-cover" /> : <div className="h-14 w-14 rounded bg-line" />}
        <input type="file" accept="image/*" onChange={pick} />
        {busy && <span className="font-normal text-ink/60">Mengunggah...</span>}
      </div>
    </div>
  );
}
