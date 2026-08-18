import Link from "next/link";

export default function Paginacion({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function hrefForPage(p: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/tenis?${qs}` : "/tenis";
  }

  return (
    <div className="flex items-center justify-center gap-6 py-10 text-sm text-[var(--color-ink)]">
      {page > 1 ? (
        <Link href={hrefForPage(page - 1)} className="hover:text-[var(--color-gold)]">
          ← Anterior
        </Link>
      ) : (
        <span className="text-[var(--color-border)]">← Anterior</span>
      )}
      <span className="text-[var(--color-muted)]">
        Página {page} de {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefForPage(page + 1)} className="hover:text-[var(--color-gold)]">
          Siguiente →
        </Link>
      ) : (
        <span className="text-[var(--color-border)]">Siguiente →</span>
      )}
    </div>
  );
}
