# Technical SEO Findings — essenceperfumes.vercel.app

## Critical: robots.txt missing
```
$ curl -sI https://essenceperfumes.vercel.app/robots.txt
HTTP/2 404
content-type: text/html; charset=utf-8
x-matched-path: /404
```
No `app/robots.ts` or `public/robots.txt` in the repo.

**Fix** — `app/robots.ts`:
```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: "https://essenceperfumes.vercel.app/sitemap.xml",
  };
}
```

## Critical: sitemap.xml missing
```
$ curl -sI https://essenceperfumes.vercel.app/sitemap.xml
HTTP/2 404
```
233 statically-generated perfume pages (`app/producto/[slug]/page.tsx` → `generateStaticParams`) plus the Supabase-backed tenis catalog have no sitemap entry.

**Fix** — `app/sitemap.ts`, generating entries from `getPerfumes()` and `getTenisPage()`/an unpaginated tenis list query, plus the static routes `/`, `/perfumes`, `/tenis`.

## High: /, /tenis, /tenis/[slug] fully dynamic and uncached
```
$ curl -sI https://essenceperfumes.vercel.app/tenis | grep -iE "cache-control|x-vercel-cache"
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
x-vercel-cache: MISS

$ curl -sI https://essenceperfumes.vercel.app/perfumes | grep -iE "cache-control|x-vercel-cache"
cache-control: public, max-age=0, must-revalidate
x-vercel-cache: HIT

$ curl -sI https://essenceperfumes.vercel.app/producto/sauvage-dior | grep -iE "cache-control|x-vercel-cache"
cache-control: public, max-age=0, must-revalidate
x-vercel-cache: PRERENDER
```
Root cause: `lib/tenis.ts` → `getTenisPage()`/`getTenisBySlug()` call `createClient()` from `lib/supabase/server.ts`, which reads `cookies()`. Any route that touches `cookies()` is forced into dynamic (per-request) rendering by Next.js, even when the visitor is anonymous and the query result would be identical for everyone. `app/page.tsx` also calls `getTenisPage()`, which is why the homepage — despite otherwise being static-shaped content — is dynamic too.

**Fix options:**
1. Use a plain `@supabase/supabase-js` client with the anon key (no cookie access) for the public read path, reserving the cookie-bound SSR client for `/admin`.
2. Or keep the current client but wrap the public query with caching (`unstable_cache` / `revalidate`) so Next can still serve a cached response even though the client touched cookies.

## High: No canonical tags
Checked `/`, `/perfumes`, `/producto/sauvage-dior` — none emit `<link rel="canonical">`. No `alternates.canonical` set in any `Metadata` export, and no `metadataBase` in `app/layout.tsx`.

## Medium: No security headers
```
$ curl -sI https://essenceperfumes.vercel.app/ | grep -iE "x-content-type|x-frame|content-security|referrer-policy|permissions-policy"
(no output — none present)
```
Only Vercel's default `Strict-Transport-Security` header is present. Add a `headers()` block in `next.config.ts`.

## What works
- `/catalogo` → `/perfumes` 301 redirect configured in `next.config.ts`
- `app/admin/layout.tsx` sets `metadata.robots = { index: false, follow: false }`
- `html lang="es"`, single H1 per page, HTTPS + HSTS enforced
