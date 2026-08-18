"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { OrdenTenis } from "@/lib/tenis";
import { CATEGORIA_LABELS } from "@/lib/format";
import { GOLD_CHEVRON_STYLE, SELECT_OPTION_CLASSNAME } from "@/lib/select-style";

const CATEGORIAS = ["todos", "hombre", "mujer"] as const;

export default function TenisExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoria = searchParams.get("categoria") ?? "todos";
  const orden = (searchParams.get("orden") as OrdenTenis) ?? "destacados";
  const q = searchParams.get("q") ?? "";

  function pushParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "todos") params.delete(key);
      else params.set(key, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-6 border-b border-[var(--color-border)] pb-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => pushParams({ categoria: c })}
            className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${
              categoria === c
                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
            }`}
          >
            {c === "todos" ? "Todos" : CATEGORIA_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            pushParams({ q: String(fd.get("q") ?? "") });
          }}
        >
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre"
            className="min-w-0 rounded-full border border-[var(--color-border)] bg-transparent px-4 py-1.5 text-sm outline-none focus:border-[var(--color-gold)] sm:w-56"
          />
        </form>
        <select
          value={orden}
          onChange={(e) => pushParams({ orden: e.target.value })}
          className="min-w-0 appearance-none rounded-full border border-[var(--color-border)] bg-[var(--color-paper)] bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pl-4 pr-9 py-1.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
          style={GOLD_CHEVRON_STYLE}
        >
          <option value="destacados" className={SELECT_OPTION_CLASSNAME}>
            Destacados
          </option>
          <option value="precio-asc" className={SELECT_OPTION_CLASSNAME}>
            Precio: menor a mayor
          </option>
          <option value="precio-desc" className={SELECT_OPTION_CLASSNAME}>
            Precio: mayor a menor
          </option>
        </select>
      </div>
    </div>
  );
}
