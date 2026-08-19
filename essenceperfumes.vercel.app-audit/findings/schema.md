# Schema & Structured Data Findings — essenceperfumes.vercel.app

## Critical: No structured data anywhere

`render_page.py` structured-data extraction on the homepage:
```json
"structured_data": { "block_count": 0, "processed_count": 0, "total_bytes": 0, "truncated": false, "blocks": [] }
```
Manual check on `/producto/sauvage-dior`:
```
$ curl -s https://essenceperfumes.vercel.app/producto/sauvage-dior | grep -oE 'application/ld\+json'
(no output)
```

No Product, Organization, WebSite, or BreadcrumbList JSON-LD exists on the site.

## Why this matters here specifically
`app/producto/[slug]/page.tsx` already resolves a `Perfume` object with `marca` (brand), `nombre` (name), `precio` (price), `imagenUrl`, and `descripcion` — every field Product schema needs is already in scope at render time. Same for `app/tenis/[slug]/page.tsx`'s `Tenis` object.

## Recommended fix

Add to `app/producto/[slug]/page.tsx` (and mirror for `app/tenis/[slug]/page.tsx`):
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: perfume.nombre,
      brand: { "@type": "Brand", name: perfume.marca },
      image: perfume.imagenUrl,
      description: perfume.descripcion,
      offers: {
        "@type": "Offer",
        priceCurrency: "COP",
        price: perfume.precio,
        availability: "https://schema.org/InStock",
      },
    }),
  }}
/>
```

Add a single Organization/WebSite JSON-LD in `app/layout.tsx` for brand entity signals (name, url, logo).

## Explicitly not recommended
Do not add FAQPage schema for SERP benefit — Google retired FAQ rich results for all sites on 2026-05-07 (no SERP feature exists for it anymore). This isn't currently present on the site, so no removal action is needed either.
