import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import { getPerfumeByIdAdmin } from "@/lib/perfumes";
import { updatePerfume, deletePerfume } from "../../actions";
import PerfumeForm from "../PerfumeForm";

export default async function EditarPerfumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const perfume = await getPerfumeByIdAdmin(id);

  if (!perfume) notFound();

  return (
    <div>
      <BackLink
        fallbackHref="/admin/perfumes"
        className="text-sm text-[var(--color-muted)] hover:text-[var(--color-gold)]"
      >
        ← Volver a perfumes
      </BackLink>

      <h1 className="mt-4 font-serif text-2xl text-[var(--color-ink)]">
        {perfume.marca} {perfume.nombre}
      </h1>

      <PerfumeForm
        action={updatePerfume.bind(null, perfume.id)}
        perfume={perfume}
        submitLabel="Guardar cambios"
      />

      <form action={deletePerfume.bind(null, perfume.id)} className="mt-6">
        <button
          type="submit"
          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)] hover:border-red-600 hover:text-red-600"
        >
          Borrar perfume
        </button>
      </form>
    </div>
  );
}
