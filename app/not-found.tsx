import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-32 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
        Error 404
      </p>
      <h1 className="font-serif text-3xl text-[var(--color-ink)]">
        No encontramos esta página
      </h1>
      <p className="text-sm text-[var(--color-muted)]">
        Puede que el producto ya no esté disponible o el enlace sea incorrecto.
      </p>
      <Link
        href="/catalogo"
        className="rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm tracking-wide text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
      >
        Ir al catálogo
      </Link>
    </div>
  );
}
