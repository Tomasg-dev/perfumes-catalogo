import type { Metadata } from "next";
import TenisExplorer from "@/components/TenisExplorer";
import TenisCard from "@/components/TenisCard";
import Paginacion from "@/components/Paginacion";
import { getTenisPage, type OrdenTenis } from "@/lib/tenis";

export const metadata: Metadata = {
  title: "Tenis | Essence",
  description: "Explora todos los tenis disponibles, filtra y encuentra el tuyo.",
  // Las variantes filtradas/paginadas (?categoria=, ?q=, ?page=) canonicalizan
  // a la vista base para no crear contenido duplicado por combinación de filtros.
  alternates: { canonical: "/tenis" },
};

const ORDENES: OrdenTenis[] = ["destacados", "precio-asc", "precio-desc"];

export default async function TenisPage({ searchParams }: PageProps<"/tenis">) {
  const sp = await searchParams;

  const categoriaRaw = typeof sp.categoria === "string" ? sp.categoria : undefined;
  const categoria =
    categoriaRaw === "hombre" || categoriaRaw === "mujer" || categoriaRaw === "unisex"
      ? categoriaRaw
      : undefined;
  const q = typeof sp.q === "string" ? sp.q : "";
  const ordenRaw = typeof sp.orden === "string" ? sp.orden : undefined;
  const orden = ORDENES.includes(ordenRaw as OrdenTenis) ? (ordenRaw as OrdenTenis) : "destacados";
  const page = Number(sp.page) || 1;

  const { items, total, totalPages } = await getTenisPage({ categoria, q, orden, page });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-ink)]">Tenis</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
          Zapatillas para hombre, mujer y unisex, con nuevas referencias
          sumándose cada semana. Filtra por categoría o precio y escríbenos
          por WhatsApp para confirmar disponibilidad y envío.
        </p>
        <p className="mt-3 text-sm text-[var(--color-muted)]">{total} tenis disponibles</p>
      </div>

      <TenisExplorer />

      {items.length === 0 ? (
        <p className="py-24 text-center text-sm text-[var(--color-muted)]">
          No encontramos tenis que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-10 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((tenis) => (
            <TenisCard key={tenis.id} tenis={tenis} />
          ))}
        </div>
      )}

      <Paginacion
        page={page}
        totalPages={totalPages}
        hrefForPage={(p) => {
          const params = new URLSearchParams();
          if (categoria) params.set("categoria", categoria);
          if (q) params.set("q", q);
          if (orden !== "destacados") params.set("orden", orden);
          if (p > 1) params.set("page", String(p));
          const qs = params.toString();
          return qs ? `/tenis?${qs}` : "/tenis";
        }}
      />
    </div>
  );
}
