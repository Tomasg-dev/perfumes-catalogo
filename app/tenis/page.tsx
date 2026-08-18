import type { Metadata } from "next";
import TenisExplorer from "@/components/TenisExplorer";
import TenisCard from "@/components/TenisCard";
import Paginacion from "@/components/Paginacion";
import { getTenisPage, type OrdenTenis } from "@/lib/tenis";

export const metadata: Metadata = {
  title: "Tenis | Essence",
  description: "Explora todos los tenis disponibles, filtra y encuentra el tuyo.",
};

const ORDENES: OrdenTenis[] = ["destacados", "precio-asc", "precio-desc"];

export default async function TenisPage({ searchParams }: PageProps<"/tenis">) {
  const sp = await searchParams;

  const categoriaRaw = typeof sp.categoria === "string" ? sp.categoria : undefined;
  const categoria = categoriaRaw === "hombre" || categoriaRaw === "mujer" ? categoriaRaw : undefined;
  const q = typeof sp.q === "string" ? sp.q : "";
  const ordenRaw = typeof sp.orden === "string" ? sp.orden : undefined;
  const orden = ORDENES.includes(ordenRaw as OrdenTenis) ? (ordenRaw as OrdenTenis) : "destacados";
  const page = Number(sp.page) || 1;

  const { items, total, totalPages } = await getTenisPage({ categoria, q, orden, page });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-ink)]">Tenis</h1>
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
        searchParams={{ categoria, q: q || undefined, orden: orden !== "destacados" ? orden : undefined }}
      />
    </div>
  );
}
