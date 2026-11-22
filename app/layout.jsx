import "./globals.css";
import { Plus_Jakarta_Sans, Amiri } from "next/font/google";
import { supabase } from "@/lib/supabase";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const amiri = Amiri({ subsets: ["latin", "arabic"], weight: ["400", "700"], variable: "--font-amiri" });

export async function generateMetadata() {
  const { data } = await supabase.from("site_settings").select("store_name, hero_subtitle").single();
  return {
    title: data?.store_name || "Abu Aka Store",
    description: data?.hero_subtitle || "Pesan mudah lewat WhatsApp",
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} ${amiri.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}