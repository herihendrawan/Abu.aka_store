import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";

export const revalidate = 60;

export default async function SiteLayout({ children }) {
  const { data } = await supabase.from("site_settings").select("*").single();
  const s = data || {};
  return (
    <>
      <Header s={s} />
      {children}
      <Footer s={s} />
      <WaFloat number={s.whatsapp_number} />
    </>
  );
}
