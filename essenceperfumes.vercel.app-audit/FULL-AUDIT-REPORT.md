# SEO Audit — essenceperfumes.vercel.app

**Date:** 2026-08-18
**Business type:** E-commerce — fragrances (233 SKUs, static catalog) + sneakers (Supabase-backed, growing catalog), checkout handled via WhatsApp
**SEO Health Score: 49 / 100**

> Scope note: no Google API credentials (PageSpeed Insights / CrUX / Search Console) were configured in this environment, so Performance and indexation findings below are based on response-header and code-level analysis rather than field CWV data. See Phase 4 of the action plan.

## Executive Summary

The site is well-built from a code-quality standpoint — clean Next.js App Router structure, correct redirects, correctly noindexed admin routes, unique per-product metadata for perfumes, and descriptive alt text throughout. But it is currently **effectively invisible to search engines in the ways that matter most for a catalog this size**: there is no `robots.txt`, no `sitemap.xml`, no structured data of any kind, and no canonical tags anywhere. None of these require new content — they're implementation gaps that a small, scoped engineering pass closes.

### Top 5 Critical/High Issues
1. **`robots.txt` and `sitemap.xml` both return 404** — none of the 240+ product URLs are formally submitted for discovery/indexing.
2. **Zero structured data site-wide** — no Product, Organization, or WebSite JSON-LD despite the data already existing on every page.
3. **No canonical tags anywhere.**
4. **The entire tenis (sneaker) section — list + every product page — is fully dynamic and uncached** (`cache-control: private, no-store`) because the Supabase client reads cookies on every anonymous request.
5. **Tenis product pages have no body content** — meta description is literally `"{name} — {category}."`.

### Top 5 Quick Wins
1. Add `app/robots.ts` and `app/sitemap.ts` — two small files fix findings #1 above entirely.
2. Add Product JSON-LD to `/producto/[slug]` and `/tenis/[slug]` using data already on the page.
3. Add `metadataBase` + `alternates.canonical` in `app/layout.tsx`.
4. Add a default Open Graph image (1200×630) — currently every WhatsApp/social share of a product link renders with no preview image at all, which is a direct hit on the business's core sharing channel.
5. Decouple the anonymous tenis-catalog read path from the cookie-bound Supabase client so `/`, `/tenis`, and `/tenis/[slug]` can be cached again.

---

## Technical SEO — 45/100 (weight 22%)

**What works:** clean URL structure, HTTPS + HSTS, correct `lang="es"`/`es_CO` locale, `/catalogo` → `/perfumes` 301 redirect, `/admin` correctly noindexed.

| Finding | Severity |
|---|---|
| `robots.txt` returns 404 | Critical |
| `sitemap.xml` returns 404 | Critical |
| `/`, `/tenis`, `/tenis/[slug]` fully dynamic, uncached (cookies() forces SSR) | High |
| No canonical tags on any page | High |
| No security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) | Medium |

**Root cause of the caching issue:** `lib/tenis.ts` calls `createClient()` from `lib/supabase/server.ts` for the public catalog read, and that client reads `cookies()`. Next.js forces any route that touches `cookies()` into dynamic (per-request) rendering — even for anonymous visitors just browsing. Compare this to `/perfumes` and `/producto/[slug]`, which read from a static local JSON file and are correctly served from Vercel's edge cache (`x-vercel-cache: HIT` / `PRERENDER`).

## Content Quality — 55/100 (weight 23%)

**What works:** all 233 perfume descriptions are verified unique (no duplicate-content risk); every perfume has fragrance notes, price, and a short description.

| Finding | Severity |
|---|---|
| Tenis product pages have zero body content | High |
| Perfume descriptions are formulaic/templated, not experiential | Medium |
| Category hub pages (`/perfumes`, `/tenis`) have no intro copy | Medium |

## On-Page SEO — 60/100 (weight 20%)

**What works:** unique title + meta description per perfume product; single correctly-placed H1 per page; clean heading hierarchy.

| Finding | Severity |
|---|---|
| No Open Graph image anywhere on the site | Medium |
| No `metadataBase` configured | Low |

## Schema & Structured Data — 10/100 (weight 10%)

| Finding | Severity |
|---|---|
| No structured data anywhere (0 JSON-LD blocks found on homepage and product pages) | Critical |

The site already has everything Product schema needs — name, brand, image, price, currency, availability — for 233+ SKUs. This is close to a pure copy-paste win.

## Performance — 50/100 (weight 10%, qualitative — no field data available)

**What works:** perfume images use `next/image` with full responsive `srcset`; `/producto/[slug]` is statically prerendered and edge-cached.

| Finding | Severity |
|---|---|
| Tenis images use `unoptimized`, bypassing next/image resizing | Medium |
| No PageSpeed Insights/CrUX credentials configured — no LCP/INP/CLS field data | Info |

## AI Search Readiness (GEO) — 50/100 (weight 10%)

**What works:** no `robots.txt` means no AI crawler is explicitly blocked; content is server-rendered in raw HTML and fully citable without JS execution.

| Finding | Severity |
|---|---|
| Missing entity/schema signals reduce AI citation confidence | Medium |
| No `llms.txt` (optional, low priority, ignored by Google) | Low |

## Images — 65/100 (weight 5%)

**What works:** descriptive alt text (brand + product name) on every image; graceful broken-image fallback UI.

| Finding | Severity |
|---|---|
| Source PNGs for perfume images run up to ~360KB (41MB total across 233 files) | Low |

---

## Search Experience (SXO)

Product pages match search intent reasonably well for a "buy X perfume in Colombia" query: name, brand, price, notes, and a direct WhatsApp CTA are all above the fold. The gap is upstream of the page itself — with no sitemap/canonical/schema, Google has little basis to decide these pages deserve to rank in the first place, and a customer searching a specific product name has no rich snippet (price, stock) to distinguish this listing from a marketplace competitor's. Closing Phase 1 (schema + sitemap) is the highest-leverage SXO fix available before any page-level UX work is warranted.

## E-commerce Notes

This is a WhatsApp-order catalog, not a transactable storefront (no on-site checkout, no marketplace listing detected) — so Google Merchant Center / Shopping ads integration and marketplace-gap analysis (Amazon, etc.) are not applicable unless that changes. Product JSON-LD (Phase 1) is still valuable independent of Merchant Center: it's what backs Google's organic product rich results (price/availability snippets in regular search, not just Shopping tab).

---

See `ACTION-PLAN.md` for the prioritized, phased fix list and `findings/` for per-category detail.
