// Número de WhatsApp de pedidos, formato internacional sin "+" ni espacios.
// Se define con NEXT_PUBLIC_WHATSAPP_NUMBER en .env.local (desarrollo) o en
// las variables de entorno de Vercel (producción) — ver README. Sin fallback
// a propósito: nunca debe quedar un número real hardcodeado en el código.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export const SITE_NAME = "Essence";

// Dominio canónico del sitio, usado para sitemap, robots, canonical y OG/JSON-LD.
// Se puede sobrescribir con NEXT_PUBLIC_SITE_URL si el dominio de producción cambia.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://essenceperfumes.vercel.app";
