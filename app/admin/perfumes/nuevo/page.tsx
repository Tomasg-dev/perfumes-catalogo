import BackLink from "@/components/BackLink";
import { createPerfume } from "../../actions";
import PerfumeForm from "../PerfumeForm";

export default function NuevoPerfumePage() {
  return (
    <div>
      <BackLink
        fallbackHref="/admin/perfumes"
        className="text-sm text-[var(--color-muted)] hover:text-[var(--color-gold)]"
      >
        ← Volver a perfumes
      </BackLink>

      <h1 className="mt-4 font-serif text-2xl text-[var(--color-ink)]">Nuevo perfume</h1>

      <PerfumeForm action={createPerfume} submitLabel="Publicar perfume" />
    </div>
  );
}
