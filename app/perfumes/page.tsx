import type { Metadata } from "next";
import CatalogExplorer from "@/components/CatalogExplorer";
import { getPerfumes } from "@/lib/sheets";

export const metadata: Metadata = {
  title: "Perfumes | Essence",
  description: "Explora todos los perfumes disponibles, filtra y encuentra el tuyo.",
  alternates: { canonical: "/perfumes" },
};

export default async function PerfumesPage() {
  const perfumes = await getPerfumes();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-ink)]">Perfumes</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
          Fragancias originales de marcas como Chanel, Dior, Carolina Herrera, Bvlgari
          y Creed, entre otras. Filtra por categoría — hombre, mujer o unisex — y
          escríbenos por WhatsApp para confirmar disponibilidad y envío.
        </p>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          {perfumes.length} fragancias disponibles
        </p>
      </div>
      <CatalogExplorer perfumes={perfumes} />
    </div>
  );
}
