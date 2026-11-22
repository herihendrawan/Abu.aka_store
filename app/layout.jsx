import "./globals.css";
import { Plus_Jakarta_Sans, Amiri } from "next/font/google";
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const amiri = Amiri({ subsets: ["latin", "arabic"], weight: ["400", "700"], variable: "--font-amiri" });

export const metadata = { title: "Toko Islami", description: "Pesan mudah lewat WhatsApp" };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} ${amiri.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
