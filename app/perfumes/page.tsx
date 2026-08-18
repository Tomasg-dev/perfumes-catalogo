import type { Metadata } from "next";
import CatalogExplorer from "@/components/CatalogExplorer";
import { getPerfumes } from "@/lib/sheets";

export const metadata: Metadata = {
  title: "Perfumes | Essence",
  description: "Explora todos los perfumes disponibles, filtra y encuentra el tuyo.",
};

export default async function PerfumesPage() {
  const perfumes = await getPerfumes();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-ink)]">Perfumes</h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          {perfumes.length} fragancias disponibles
        </p>
      </div>
      <CatalogExplorer perfumes={perfumes} />
    </div>
  );
}
