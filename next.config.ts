import type { NextConfig } from "next";

// next/image exige que cualquier src externo esté en remotePatterns, incluso
// cuando se usa unoptimized — si no, lanza "Invalid src prop" y tumba la
// página entera. Las imágenes de tenis viven en Supabase Storage.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  async redirects() {
    return [
      {
        source: "/catalogo",
        destination: "/perfumes",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
