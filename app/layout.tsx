import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { CartProvider } from "@/lib/cart-context";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import { buildOrganizationJsonLd } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | Catálogo de perfumes`,
  description:
    "Descubre nuestra selección de perfumes y tenis, y consulta disponibilidad directamente por WhatsApp.",
  openGraph: {
    title: `${SITE_NAME} | Catálogo de perfumes`,
    description:
      "Descubre nuestra selección de perfumes y tenis, y consulta disponibilidad directamente por WhatsApp.",
    siteName: SITE_NAME,
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} | Catálogo de perfumes`,
    description:
      "Descubre nuestra selección de perfumes y tenis, y consulta disponibilidad directamente por WhatsApp.",
  },
  verification: {
    google: "re_J4pI1hWHN61ZtJv409mMhdtP6TteY06kzmZS-kl8",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }}
        />
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
