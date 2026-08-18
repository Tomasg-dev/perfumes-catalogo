import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CartToast from "@/components/CartToast";
import { CartProvider } from "@/lib/cart-context";
import { SITE_NAME } from "@/lib/config";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | Catálogo de perfumes`,
  description:
    "Descubre nuestra selección de perfumes y consulta disponibilidad directamente por WhatsApp.",
  openGraph: {
    title: `${SITE_NAME} | Catálogo de perfumes`,
    description:
      "Descubre nuestra selección de perfumes y consulta disponibilidad directamente por WhatsApp.",
    siteName: SITE_NAME,
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} | Catálogo de perfumes`,
    description:
      "Descubre nuestra selección de perfumes y consulta disponibilidad directamente por WhatsApp.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
