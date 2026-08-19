# Content Quality Findings — essenceperfumes.vercel.app

## High: Tenis product pages have no body content

`app/tenis/[slug]/page.tsx` renders only: brand-less name, category, color, price, WhatsApp/cart buttons. No description text anywhere on the page.

`generateMetadata` for the same route:
```ts
return {
  title: `${tenis.nombre} | Essence`,
  description: `${tenis.nombre} — ${CATEGORIA_LABELS[tenis.categoria]}.`,
};
```
Example real output: `"NIKE TN — Hombre."` — 17 characters, well under any workable meta description length, and there is no on-page copy to compensate.

**Fix:** add a `descripcion` field to the tenis Supabase table (mirroring `perfumes.sample.json`'s `descripcion` field) and render it on the detail page.

## Medium: Perfume descriptions are formulaic

Verified via direct inspection of `data/perfumes.sample.json` (233 entries):
```
Total perfumes: 233
Perfumes with missing/thin description: 0
avg desc length: 139
Unique descriptions: 233 / 233   (no duplicates)
```
All descriptions follow one template: *"Combina [notas salida] en la salida con [notas corazón] en el corazón, sobre una base cálida de [notas fondo]."* They are unique (good — no duplicate-content penalty risk) but formulaic, with no brand storytelling, occasion framing, or first-hand sensory language.

**Fix priority:** low urgency given 233 pages already have unique, on-topic content. If investing further, prioritize the `destacado: true` (featured) subset first rather than rewriting all 233.

## Medium: Category hub pages carry no descriptive copy

`app/perfumes/page.tsx` and the tenis equivalent render only an `<h1>` + product count before the filter/grid UI — no intro paragraph. These are exactly the pages positioned to rank for broad category terms ("perfumes para hombre", "tenis nike originales").

**Fix:** add 2-3 sentences under each H1 naturally covering the category's main brands/subtypes.

## What works
- All 233 perfume descriptions verified unique — no duplicate-content risk
- Every perfume carries structured notes data (salida/corazón/fondo) usable for future schema/content work
