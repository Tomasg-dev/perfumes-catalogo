import Link from "next/link";
import { getAllPerfumesAdmin } from "@/lib/perfumes";
import PerfumesList from "./PerfumesList";

export default async function AdminPerfumesPage() {
  const perfumes = await getAllPerfumesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-[var(--color-ink)]">
          Perfumes ({perfumes.length})
        </h1>
        <Link
          href="/admin/perfumes/nuevo"
          className="rounded-full border border-[var(--color-ink)] px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
        >
          + Nuevo perfume
        </Link>
      </div>

      {perfumes.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-muted)]">
          Todavía no hay perfumes cargados.
        </p>
      ) : (
        <PerfumesList perfumes={perfumes} />
      )}
    </div>
  );
}
