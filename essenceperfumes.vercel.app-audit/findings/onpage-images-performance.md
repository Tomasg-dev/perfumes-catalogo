# On-Page, Images & Performance Findings — essenceperfumes.vercel.app

## On-Page SEO

### Medium: No Open Graph image anywhere
`app/layout.tsx` `openGraph` sets `title`, `description`, `siteName`, `locale`, `type` — no `images`. No page overrides it. Confirmed via header scan on homepage and a product page: no `og:image` meta tag present.

This directly affects the core sales channel: every product link a customer or seller pastes into WhatsApp renders with no preview image.

**Fix:** add a default 1200×630 OG image site-wide, then per-product OG images generated from each perfume/tenis's existing `imagenUrl` (Next's `ImageResponse`/`opengraph-image.tsx` convention works well here since the source images already exist).

### Low: No metadataBase
`app/layout.tsx` has no `metadataBase`, needed for Next to resolve relative canonical/OG URLs to absolute ones once those are added.

## Images

### What works
Every product image (perfumes and tenis) carries descriptive alt text combining brand + product name, e.g. `alt="Dior Sauvage Dior"`, `alt="NIKE TN"`. `PerfumeImage.tsx` also has a graceful fallback (`BottlePlaceholder`) when an image URL 404s.

### Low: Large source PNGs
```
$ du -sh public/perfumes/
41M   public/perfumes/
```
Individual files run 70KB-360KB as PNG (product-on-transparent-background shots). `next/image` automatically serves resized/format-negotiated derivatives at request time (confirmed via `srcSet` output showing multiple widths + `/_next/image` proxying), so live page weight is already mitigated — this is an origin-storage/build-time concern, not a user-facing one.

## Performance (qualitative — no field data)

### Medium: Tenis images served `unoptimized`
`components/TenisCard.tsx` and `app/tenis/[slug]/page.tsx` both pass `unoptimized` to `PerfumeImage`, which forwards it to `next/image`. This bypasses Next's resizing/format pipeline entirely — the same Supabase-hosted `.webp` file (confirmed 83KB via `content-length`) is served to every viewport instead of a responsive `srcset`.

```
$ curl -s https://essenceperfumes.vercel.app/tenis | grep -oE '<img[^>]*>' | head -1
<img alt="NIKE TN" loading="lazy" decoding="async" data-nimg="fill" ... src="https://uzdorfqodezhheogcvgh.supabase.co/storage/v1/object/public/tenis/....webp"/>
```
No `srcSet` attribute present (compare to the perfume `<img>` tags, which have a full `srcSet`).

`next.config.ts` already whitelists the Supabase storage host in `remotePatterns`, so `unoptimized` can likely be removed safely — worth testing after removal since the original `unoptimized` prop may have been added to work around a specific `remotePatterns` issue (see comment in `next.config.ts`).

### Info: No CWV field data
No `GOOGLE_API_KEY` / PageSpeed Insights / CrUX credentials configured in this environment — `claude-seo run google_auth.py --check` reports Credential Tier -1 across all Google SEO APIs. Recommend connecting an API key before the next audit for real LCP/INP/CLS numbers.
