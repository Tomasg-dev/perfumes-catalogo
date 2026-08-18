"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-32 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
        Algo salió mal
      </p>
      <h1 className="font-serif text-3xl text-[var(--color-ink)]">
        No pudimos cargar esta página
      </h1>
      <p className="text-sm text-[var(--color-muted)]">
        Intenta de nuevo en unos segundos. Si el problema persiste, contáctanos por
        WhatsApp.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm tracking-wide text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-full px-6 py-3 text-sm tracking-wide text-[var(--color-muted)] hover:text-[var(--color-gold)]"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
