import { SITE_URL, SITE_NAME } from "./config";

export function absoluteUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Los nombres de archivo locales de perfumes traen espacios/paréntesis
  // (p.ej. "212 MEN NYC PASTA (100ML).png"); hay que codificarlos para que
  // la URL absoluta sea válida en JSON-LD.
  const encodedPath = encodeURI(path.startsWith("/") ? path : `/${path}`);
  return `${SITE_URL}${encodedPath}`;
}

export function buildProductJsonLd(params: {
  name: string;
  brand?: string;
  description?: string;
  image?: string | null;
  price: number | null;
  url: string;
}) {
  const { name, brand, description, image, price, url } = params;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url,
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    ...(description ? { description } : {}),
    ...(image ? { image: absoluteUrl(image) } : {}),
    ...(price != null
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "COP",
            price,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
  };
}
