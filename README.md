# Essence — Perfumes y Tenis

Sitio web con dos catálogos (perfumes y tenis). Los clientes exploran
productos y son redirigidos a WhatsApp para completar su pedido, con un
carrito compartido entre ambos catálogos. Construido con Next.js, TypeScript
y Tailwind CSS.

- **Perfumes** (`/perfumes`): catálogo fijo definido en
  `data/perfumes.sample.json`, editado a mano.
- **Tenis** (`/tenis`): catálogo dinámico en Supabase (Postgres + Storage),
  gestionado desde un panel admin en `/admin`.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Configuración

Copia `.env.local.example` a `.env.local` y ajusta los valores:

```bash
cp .env.local.example .env.local
```

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número de WhatsApp de pedidos, con código de
  país y sin espacios ni "+" (ej. `573205757116`).
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: credenciales
  del proyecto de Supabase que respalda el catálogo de tenis y el panel
  admin (Settings → API en el dashboard de Supabase).

**Sobre las fotos de perfumes:** viven en `public/perfumes/` y cada producto
en `data/perfumes.sample.json` referencia la suya en `imagenUrl` (ruta
`/perfumes/archivo.png`). Si un producto no tiene foto todavía, deja
`imagenUrl` en `null`: el sitio muestra automáticamente una ilustración de
reemplazo, nunca un ícono roto.

**Sobre las fotos de tenis:** viven en Supabase Storage (bucket `tenis`) y se
suben desde el panel admin, que las comprime a WebP antes de publicarlas.

## Panel admin (`/admin`)

Gestiona el catálogo de tenis: subir varias imágenes a la vez (con nombre,
categoría, color y precio editables antes de publicar), y editar o borrar
productos ya cargados. Requiere una cuenta creada manualmente en
**Authentication → Users** dentro del dashboard de Supabase — no hay registro
público.

## Desplegar gratis en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. Entra a [vercel.com](https://vercel.com), crea una cuenta gratuita (plan
   Hobby) e importa el repositorio.
3. En la configuración del proyecto, agrega las variables de entorno
   `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Despliega. Vercel te da un dominio gratuito `tu-proyecto.vercel.app`. Un
   dominio propio es opcional y solo tiene el costo del dominio en sí
   (Vercel no cobra por el hosting en este plan).

## Estructura del proyecto

- `app/` — páginas con Next.js App Router: Home, `/perfumes`, `/tenis`,
  `/producto/[slug]`, `/tenis/[slug]` y el panel `/admin`.
- `components/` — componentes de UI reutilizables.
- `lib/sheets.ts` — obtiene el catálogo de perfumes desde
  `data/perfumes.sample.json`.
- `lib/tenis.ts` — consulta el catálogo de tenis en Supabase (paginado y
  filtrado en servidor).
- `lib/supabase/` — clientes de Supabase (browser, server, proxy/sesión).
- `lib/cart-items.ts` — construye los ítems del carrito compartido a partir
  de un perfume o un tenis.
- `lib/config.ts` — número de WhatsApp y demás configuración del sitio.
- `data/perfumes.sample.json` — catálogo oficial de perfumes.
- `proxy.ts` — protege las rutas `/admin/**` sin sesión iniciada.

## Comandos

```bash
npm run dev     # servidor de desarrollo
npm run build   # build de producción
npm run start   # servir el build de producción
npm run lint    # revisar el código
```
