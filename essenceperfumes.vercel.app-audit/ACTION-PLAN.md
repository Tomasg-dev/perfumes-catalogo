# Action Plan — essenceperfumes.vercel.app

Ordered by dependency: robots/sitemap first (nothing else matters if pages aren't discoverable), then schema and caching (biggest ranking/UX leverage), then content and hardening.

## Phase 1: Critical Fixes (Week 1)

- [ ] **Add `app/robots.ts`**
  - *Rests on:* a 404 at `/robots.txt` gives crawlers zero explicit guidance and no sitemap pointer.
  - *Unblocks:* Phase 1's sitemap item (robots.ts should reference sitemap.xml).
  - *How would we know this failed:* `curl -I https://essenceperfumes.vercel.app/robots.txt` still returns 404 after deploy.
  - *Leading indicator:* GSC's robots.txt tester shows the file as valid.

- [ ] **Add `app/sitemap.ts`** covering `/`, `/perfumes`, `/tenis`, every `/producto/[slug]` (233 static perfumes), every `/tenis/[slug]` (pull from the same Supabase query used for the catalog)
  - *Rests on:* 233+ product pages currently have no formal indexing signal.
  - *Depends on:* nothing blocking; can ship same week as robots.ts.
  - *How would we know this failed:* `sitemap.xml` 404s, or GSC reports 0 URLs discovered from it.
  - *Leading indicator:* GSC "Sitemaps" report shows submitted vs. indexed URL count climbing week over week.

- [ ] **Add Product JSON-LD** to `/producto/[slug]` and `/tenis/[slug]` (name, image, brand, `offers.price`, `offers.priceCurrency: "COP"`, `offers.availability`)
  - *Rests on:* the site has zero structured data despite holding every field Product schema needs already.
  - *Unblocks:* Google Merchant-style rich result eligibility (price/availability snippets), and strengthens Phase 3's Organization schema by giving Google two consistent, related schema types.
  - *How would we know this failed:* Google's Rich Results Test on a product URL shows no Product markup detected.
  - *Leading indicator:* GSC "Enhancements" report starts showing valid Product items.

## Phase 2: High-Impact Improvements (Weeks 2-3)

- [ ] **Decouple the anonymous tenis read path from the cookie-bound Supabase client** (or add `revalidate`/ISR) so `/`, `/tenis`, `/tenis/[slug]` stop forcing full SSR on every request
  - *Rests on:* `cookies()` in `lib/supabase/server.ts` forces dynamic rendering even for anonymous catalog browsing; `/perfumes` proves the static path is faster (edge `HIT`/`PRERENDER` vs `MISS`).
  - *How would we know this failed:* `curl -I` on `/tenis` still shows `cache-control: private, no-store`.
  - *Leading indicator:* `x-vercel-cache: HIT` starts appearing on repeat `/tenis*` requests; TTFB drops in real-user monitoring.

- [ ] **Add `metadataBase` + `alternates.canonical`** in `app/layout.tsx` (and per-page overrides where needed)
  - *Rests on:* no canonical tags exist anywhere; relative OG/canonical URLs can't resolve without `metadataBase`.
  - *How would we know this failed:* view-source on any page still shows no `<link rel="canonical">`.
  - *Leading indicator:* GSC "Page indexing" report shows fewer "Duplicate without user-selected canonical" entries over time.

- [ ] **Write real descriptions for tenis product pages**, replacing `"{name} — {category}."`
  - *Rests on:* current meta descriptions are below any reasonable thin-content threshold, and the page body has zero descriptive text.
  - *How would we know this failed:* meta descriptions in view-source are still one clause long.
  - *Leading indicator:* average description length across tenis products (comparable metric already tracked for perfumes: 139 chars avg) starts climbing toward parity.

- [ ] **Add a default + per-product Open Graph image**
  - *Rests on:* every product link shared via WhatsApp — the business's primary conversion channel — currently shows no preview image.
  - *How would we know this failed:* pasting a product URL into WhatsApp/Facebook's link debugger still shows no image.
  - *Leading indicator:* WhatsApp/social link previews start rendering the product photo.

## Phase 3: Content & Authority (Month 2)

- [ ] Add 2-3 sentence intro copy to `/perfumes` and `/tenis` hub pages
- [ ] Add Organization/WebSite JSON-LD in the root layout
- [ ] Add security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) via `next.config.ts` `headers()`
- [ ] Remove `unoptimized` from tenis product images now that `remotePatterns` already allow the Supabase host

## Phase 4: Monitoring & Iteration (Ongoing)

- [ ] Submit the new `sitemap.xml` in Google Search Console once Phase 1 ships; watch indexation climb
- [ ] Connect a PageSpeed Insights API key (`GOOGLE_API_KEY`) so the next `/seo audit` can pull real LCP/INP/CLS field data instead of code-level inference
- [ ] Re-run `/seo audit` after Phase 1-2 ship to confirm the health score moved off 49/100
