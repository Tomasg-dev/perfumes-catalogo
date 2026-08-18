# Catálogo de Perfumes

Sitio web de catálogo de perfumes. Los clientes exploran productos y son
redirigidos a WhatsApp para completar su pedido. Construido con Next.js,
TypeScript y Tailwind CSS. El catálogo vive en `data/perfumes.sample.json`.

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

**Sobre las fotos:** viven en `public/perfumes/` y cada producto en
`data/perfumes.sample.json` referencia la suya en `imagenUrl` (ruta
`/perfumes/archivo.png`). Si un producto no tiene foto todavía, deja
`imagenUrl` en `null`: el sitio muestra automáticamente una ilustración de
reemplazo, nunca un ícono roto.

## Desplegar gratis en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. Entra a [vercel.com](https://vercel.com), crea una cuenta gratuita (plan
   Hobby) e importa el repositorio.
3. En la configuración del proyecto, agrega la variable de entorno
   `NEXT_PUBLIC_WHATSAPP_NUMBER`.
4. Despliega. Vercel te da un dominio gratuito `tu-proyecto.vercel.app`. Un
   dominio propio es opcional y solo tiene el costo del dominio en sí
   (Vercel no cobra por el hosting en este plan).

## Estructura del proyecto

- `app/` — páginas (Home, Catálogo, Detalle de producto) con Next.js App
  Router.
- `components/` — componentes de UI reutilizables.
- `lib/sheets.ts` — obtiene el catálogo desde `data/perfumes.sample.json`.
- `lib/config.ts` — número de WhatsApp y demás configuración del sitio.
- `data/perfumes.sample.json` — catálogo oficial de productos.

## Comandos

```bash
npm run dev     # servidor de desarrollo
npm run build   # build de producción
npm run start   # servir el build de producción
npm run lint    # revisar el código
```
