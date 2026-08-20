import type { Metadata } from "next";
import CatalogExplorer from "@/components/CatalogExplorer";
import BottleIcon from "@/components/icons/BottleIcon";
import { getPerfumes } from "@/lib/sheets";
import type { Categoria } from "@/lib/types";

export const metadata: Metadata = {
  title: "Perfumes | Essence",
  description: "Explora todos los perfumes disponibles, filtra y encuentra el tuyo.",
  alternates: { canonical: "/perfumes" },
};

const CATEGORIAS_VALIDAS: Categoria[] = ["hombre", "mujer", "unisex"];
const ORDENES_VALIDOS = ["destacados", "precio-asc", "precio-desc"] as const;

export default async function PerfumesPage({ searchParams }: PageProps<"/perfumes">) {
  const sp = await searchParams;
  const perfumes = await getPerfumes();

  const categoriaRaw = typeof sp.categoria === "string" ? sp.categoria : undefined;
  const categoria = CATEGORIAS_VALIDAS.includes(categoriaRaw as Categoria)
    ? (categoriaRaw as Categoria)
    : "todos";
  const busqueda = typeof sp.q === "string" ? sp.q : "";
  const ordenRaw = typeof sp.orden === "string" ? sp.orden : undefined;
  const orden = ORDENES_VALIDOS.includes(ordenRaw as (typeof ORDENES_VALIDOS)[number])
    ? (ordenRaw as (typeof ORDENES_VALIDOS)[number])
    : "destacados";
  const mostrar = Number(sp.mostrar) || 36;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="flex items-center justify-center gap-3 font-serif text-4xl text-[var(--color-ink)]">
          Perfumes
          <BottleIcon className="h-9 w-auto text-[var(--color-gold)]" />
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
          Fragancias de marcas como Chanel, Dior, Carolina Herrera, Bvlgari
          y Creed, entre otras. Filtra por categoría — hombre, mujer o unisex — y
          escríbenos por WhatsApp para confirmar disponibilidad y envío.
        </p>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          {perfumes.length} fragancias disponibles
        </p>
      </div>
      <CatalogExplorer
        perfumes={perfumes}
        initialCategoria={categoria}
        initialBusqueda={busqueda}
        initialOrden={orden}
        initialVisibleCount={mostrar}
      />
    </div>
  );
}
